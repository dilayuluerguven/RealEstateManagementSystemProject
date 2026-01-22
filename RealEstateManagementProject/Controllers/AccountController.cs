using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Entities.Concrete;
using System.Security.Claims;

namespace RealEstateManagementProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ILogService _logService;

        public AccountController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var userIdClaim = User?.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized();

            int userId = int.Parse(userIdClaim.Value);

            var userNameClaim = User?.FindFirst(ClaimTypes.Name);
            var userName = userNameClaim?.Value ?? "Bilinmeyen Kullanıcı";

            await _logService.AddAsync(new Log
            {
                UserId = userId,
                IslemTipi = "logout",
                Durum = "success",
                Aciklama = $"{userName} çıkış yaptı",
                IpAdresi = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "0.0.0.0",
                Tarih = DateTime.UtcNow
            });

            return Ok();
        }
    }
}
