using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Business.Concrete;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities.Concrete;

using System.Security.Claims;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogService _logService;


        public AuthController(IAuthService authService, ILogService logService)
        {
            _authService = authService;
            _logService = logService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto dto)
        {
            var ipAddress =
                HttpContext.Connection.RemoteIpAddress?.ToString() ?? "UNKNOWN";

            var user = await _authService.LoginAsync(dto, ipAddress);

            if (user == null)
                return BadRequest("Email veya şifre hatalı.");

            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserForRegisterDto dto)
        {
            var ipAddress =
                HttpContext.Connection.RemoteIpAddress?.ToString() ?? "UNKNOWN";

            var result = await _authService.RegisterAsync(dto, ipAddress);

            if (!result)
                return BadRequest("Bu e-mail zaten kayıtlı.");

            return Ok("Kullanıcı başarıyla oluşturuldu.");
        }
        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            var userId = int.Parse(userIdClaim.Value);

            await _logService.AddAsync(new Log
            {
                UserId = userId,
                IslemTipi = "LOGOUT",
                Durum = "SUCCESS",
                Aciklama = "Kullanıcı çıkış yaptı",
                IpAdresi = HttpContext.Connection.RemoteIpAddress?.ToString()

            });

            return Ok();
        }

    }
}
