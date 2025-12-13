using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public AuthService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;
        }

        public async Task<UserDto?> LoginAsync(
            UserForLoginDto loginDto,
            string ipAddress)
        {
            var hashedPassword = HashPassword(loginDto.Sifre);

            var user = await _context.Users.FirstOrDefaultAsync(x =>
                x.Email == loginDto.Email &&
                x.Sifre == hashedPassword);

            if (user == null)
                return null;

            await _logService.AddAsync(new Log
            {
                UserId = user.Id,
                IslemTipi = "LOGIN",
                Durum = "SUCCESS",
                Aciklama = "Kullanıcı giriş yaptı",
                IpAdresi = ipAddress,
                Tarih = DateTime.UtcNow
            });

            return new UserDto
            {
                Id = user.Id,
                AdSoyad = user.AdSoyad,
                Email = user.Email,
                Rol = user.Rol
            };
        }

        public async Task<bool> RegisterAsync(
            UserForRegisterDto registerDto,
            string ipAddress)
        {
            var result = await _context.Users.AnyAsync(x =>
                x.Email == registerDto.Email);

            if (result)
                return false;

            var user = new User
            {
                AdSoyad = registerDto.AdSoyad,
                Email = registerDto.Email,
                Rol = registerDto.Rol,
                Sifre = HashPassword(registerDto.Sifre)
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            await _logService.AddAsync(new Log
            {
                UserId = user.Id,
                IslemTipi = "REGISTER",
                Durum = "SUCCESS",
                Aciklama = "Kullanıcı kaydı oluşturuldu",
                IpAdresi = ipAddress,
                Tarih = DateTime.UtcNow
            });

            return true;
        }

        private string HashPassword(string sifre)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(sifre));
            return Convert.ToHexString(bytes);
        }
    }
}
