using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        public UserService(ApplicationDbContext context)
        {
            _context = context;
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
            var mevcutKullanici = await _context.Users.FirstOrDefaultAsync(x => x.Email == dto.Email);
            if (mevcutKullanici != null)
                return false;
            string sifreHash = Sha256Hash(dto.Sifre);
            var yeniKullanici = new User
            {
                AdSoyad = dto.AdSoyad,
                Email = dto.Email,
                Rol = dto.Rol,
                Sifre = sifreHash
            };
            await _context.Users.AddAsync(yeniKullanici);
            await _context.SaveChangesAsync();

            return true;

        }
        public async Task<bool> UpdateUserAsync(int id, UserForRegisterDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
            {
                return false;
            }
            var emailKontrol = await _context.Users.AnyAsync(x => x.Email == dto.Email && x.Id != id);
            if (emailKontrol)
                return false;

            user.AdSoyad = dto.AdSoyad;
            user.Email = dto.Email;
            user.Rol = dto.Rol;
            if (!string.IsNullOrWhiteSpace(dto.Sifre))
            {
                user.Sifre = Sha256Hash(dto.Sifre);
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            return true;

        }
        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return false;
            var tasinmazlar = _context.Tasinmazlar.Where(t => t.UserId == id);
            _context.Tasinmazlar.RemoveRange(tasinmazlar);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        private string Sha256Hash(string metin)
        {
            using (var sha = System.Security.Cryptography.SHA256.Create())
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(metin);
                var hash = sha.ComputeHash(bytes);
                return BitConverter.ToString(hash).Replace("-", "").ToLower();
            }
        }

    }
}