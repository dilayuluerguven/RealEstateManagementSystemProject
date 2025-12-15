using System.Security.Cryptography;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Helpers;

using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, ILogService logService, IConfiguration configuration)
        {
            _context = context;
            _logService = logService;
            _configuration = configuration;
        }

        public async Task<UserDto?> LoginAsync(
            UserForLoginDto loginDto,
            string ipAddress)
        {
            var hashedPassword = HashHelper.Sha256Hash(loginDto.Sifre);

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
                Rol = user.Rol,
                Token = CreateToken(user)
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
                Sifre = HashHelper.Sha256Hash(registerDto.Sifre)
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

        private string CreateToken(User user)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Rol)
            };

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)
            );

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(
                    int.Parse(_configuration["Jwt:ExpireMinutes"]!)
                ),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
