using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
                return NotFound("Kullanıcı bulunamadı.");

            return Ok(user);
        }
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] UserForRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Bilgiler gecerli değil.");
            var result=await _userService.CreateUserAsync(dto);
            if (!result)
                return BadRequest("Kullanıcı oluşturulamadı.");
            return Ok("Kullanıcı başarıyla oluşturuldu.");
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserForRegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest("Bilgiler geçerli değil.");

            var result = await _userService.UpdateUserAsync(id, dto);

            if (!result)
                return BadRequest("Kullanıcı güncellenemedi.");
            return Ok("Kullanıcı başarıyla güncellendi.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (!result)
                return BadRequest("Kullanıcı silinemedi.");

            return Ok("Kullanıcı başarıyla silindi.");
        }

    }
}
