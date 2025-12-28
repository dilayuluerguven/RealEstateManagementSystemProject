using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;
using RealEstateManagementProject.Helpers;

namespace RealEstateManagementProject.Business.Concrete
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public UserService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            var users = await _context.Users.ToListAsync();
            var result = users.Select(x => new UserDto
            {
                Id = x.Id,
                AdSoyad = x.AdSoyad,
                Email = x.Email,
                Rol = x.Rol
            }).ToList();
            return result;
        }
        public async Task<UserDto> GetUserByIdAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
                return null;

            var result = new UserDto
            {
                Id = user.Id,
                AdSoyad = user.AdSoyad,
                Email = user.Email,
                Rol = user.Rol
            };
            return result;
        }

        public async Task<bool> CreateUserAsync(UserForRegisterDto dto)
        {
            try
            {
                var mevcutKullanici = await _context.Users
                    .FirstOrDefaultAsync(x => x.Email == dto.Email);

                if (mevcutKullanici != null)
                    return false;

                var yeniKullanici = new User
                {
                    AdSoyad = dto.AdSoyad,
                    Email = dto.Email,
                    Rol = dto.Rol,
                    Sifre = HashHelper.Sha256Hash(dto.Sifre)
                };

                await _context.Users.AddAsync(yeniKullanici);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "SUCCESS",
                    Aciklama = $"Kullanıcı oluşturuldu: {dto.Email}",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "ERROR",
                    Aciklama = $"Kullanıcı oluşturulamadı: {dto.Email}",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> UpdateUserAsync(int id, UserUpdateDto dto)
        {
            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (user == null)
                    return false;

                var emailKontrol = await _context.Users
                    .AnyAsync(x => x.Email == dto.Email && x.Id != id);

                if (emailKontrol)
                    return false;

                user.AdSoyad = dto.AdSoyad;
                user.Email = dto.Email;
                user.Rol = dto.Rol;

                if (!string.IsNullOrWhiteSpace(dto.Sifre))
                {
                    user.Sifre = HashHelper.Sha256Hash(dto.Sifre);
                }

                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "SUCCESS",
                    Aciklama = $"Kullanıcı güncellendi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch (Exception)
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "ERROR",
                    Aciklama = $"Kullanıcı güncellenemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
                if (user == null)
                    return false;

                var tasinmazlar = _context.Tasinmazlar.Where(t => t.UserId == id);
                _context.Tasinmazlar.RemoveRange(tasinmazlar);
                _context.Users.Remove(user);

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "SUCCESS",
                    Aciklama = $"Kullanıcı silindi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await transaction.RollbackAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "ERROR",
                    Aciklama = $"Kullanıcı silinemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }

    }
}