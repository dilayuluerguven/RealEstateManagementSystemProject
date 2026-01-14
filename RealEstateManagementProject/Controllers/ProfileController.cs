using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;
using System.Security.Claims;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] 
    public class ProfileController : ControllerBase
    {
        private readonly IUserService _userService;

        public ProfileController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UserUpdateDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Geçersiz veri");

            var userId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var result = await _userService.UpdateUserAsync(
                targetUserId: userId,
                dto: dto,
                actorUserId: userId
            );

            if (!result)
                return BadRequest("Profil güncellenemedi");

            return Ok(new { message = "Profil güncellendi" });
        }
    }
}
