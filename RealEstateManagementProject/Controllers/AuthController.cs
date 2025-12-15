using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
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
    }
}
