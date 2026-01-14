using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;
using System.Security.Claims;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "Kullanıcı bulunamadı."
                });
            }

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserForRegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Geçersiz veri gönderildi."
                });
            }

            var actorUserId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var result = await _userService.CreateUserAsync(dto, actorUserId);

            if (!result)
            {
                return BadRequest(new
                {
                    message = "Bu email ile kayıtlı bir kullanıcı zaten var."
                });
            }

            return Ok(new
            {
                message = "Kullanıcı başarıyla oluşturuldu."
            });
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new
                {
                    message = "Geçersiz veri gönderildi."
                });
            }

            var actorUserId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var result = await _userService.UpdateUserAsync(
                id,
                dto,
                actorUserId
            );

            if (!result)
            {
                return BadRequest(new
                {
                    message = "Kullanıcı güncellenemedi."
                });
            }

            return Ok(new
            {
                message = "Kullanıcı başarıyla güncellendi."
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var actorUserId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!
            );

            var result = await _userService.DeleteUserAsync(
                id,
                actorUserId
            );

            if (!result)
            {
                return BadRequest(new
                {
                    message = "Kullanıcı silinemedi (son admin olabilir)."
                });
            }

            return Ok(new
            {
                message = "Kullanıcı başarıyla silindi.",
                selfDeleted = actorUserId == id
            });
        }
        

    }
}
