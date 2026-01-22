using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;
using System.Security.Claims;

namespace RealEstateManagementProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasinmazController : ControllerBase
    {
        private const string ROLE_ADMIN = "Admin";  

        private readonly ITasinmazService _tasinmazService;

        public TasinmazController(ITasinmazService tasinmazService)
        {
            _tasinmazService = tasinmazService;
        }

        private bool TryGetUserId(out int userId)
        {
            userId = 0;
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null) return false;
            return int.TryParse(claim.Value, out userId);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            if (User.IsInRole(ROLE_ADMIN))          
            {
                var result = await _tasinmazService.GetAllAsync(null);
                return Ok(result);
            }

            if (!TryGetUserId(out int userId))
                return Unauthorized();

            var userResult = await _tasinmazService.GetAllAsync(userId);
            return Ok(userResult);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            if (!TryGetUserId(out int userId))
                return Unauthorized();

            bool isAdmin = User.IsInRole(ROLE_ADMIN);  
            var result = await _tasinmazService.GetByIdAsync(id, userId, isAdmin);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromForm] TasinmazFormDto form)
        {
            if (!TryGetUserId(out int userId))
                return Unauthorized();

            var dto = new TasinmazCreateUpdateDto
            {
                IlId = int.Parse(form.IlId!),
                IlceId = int.Parse(form.IlceId!),
                MahalleId = int.Parse(form.MahalleId!),
                Ada = int.Parse(form.Ada!),
                Parsel = int.Parse(form.Parsel!),
                Adres = form.Adres!,
                EmlakTipi = form.EmlakTipi!,
                Koordinat = form.Koordinat!,
                Image = form.Image,
                UserId = userId
            };

            var result = await _tasinmazService.AddAsync(dto);
            if (!result) return BadRequest();

            return Ok();
        }


        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromForm] TasinmazFormDto form)
        {
            if (!TryGetUserId(out int userId))
                return Unauthorized();

            bool isAdmin = User.IsInRole(ROLE_ADMIN);

            var dto = new TasinmazCreateUpdateDto
            {
                IlId = int.Parse(form.IlId!),
                IlceId = int.Parse(form.IlceId!),
                MahalleId = int.Parse(form.MahalleId!),
                Ada = int.Parse(form.Ada!),
                Parsel = int.Parse(form.Parsel!),
                Adres = form.Adres!,
                EmlakTipi = form.EmlakTipi!,
                Koordinat = form.Koordinat!,
                Image = form.Image,
                UserId = userId
            };

            var result = await _tasinmazService.UpdateAsync(id, dto, isAdmin);
            if (!result) return NotFound();

            return Ok();
        }


        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (!TryGetUserId(out int userId))
                return Unauthorized();

            bool isAdmin = User.IsInRole(ROLE_ADMIN);   

            var result = await _tasinmazService.DeleteAsync(id, userId, isAdmin);

            if (!result) return NotFound();

            return Ok();
        }

        [AllowAnonymous]
        [HttpGet("{id}/image")]
        public async Task<IActionResult> GetImage(int id)
        {
            var result = await _tasinmazService.GetImageAsync(id);
            if (result == null)
                return NotFound();

            return File(result.Value.Data, result.Value.ContentType);
        }

        [HttpDelete("{id}/image")]
        public async Task<IActionResult> DeleteImage(int id)
        {
            if (!TryGetUserId(out int userId))
                return Unauthorized();

            bool isAdmin = User.IsInRole(ROLE_ADMIN);   

            var result = await _tasinmazService.DeleteImageAsync(id, userId, isAdmin);

            if (!result)
                return BadRequest("Resim silinemedi");

            return Ok();
        }
    }
}
