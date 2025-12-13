using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MahalleController : ControllerBase
    {
        private readonly IMahalleService _mahalleService;

        public MahalleController(IMahalleService mahalleService)
        {
            _mahalleService = mahalleService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _mahalleService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _mahalleService.GetByIdAsync(id);

            if (result == null)
                return NotFound("Mahalle bulunamadı.");

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(MahalleDto dto)
        {
            var result = await _mahalleService.AddAsync(dto);

            if (!result)
                return BadRequest("Mahalle eklenemedi.");

            return Ok("Mahalle başarıyla eklendi.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, MahalleDto dto)
        {
            var result = await _mahalleService.UpdateAsync(id, dto);

            if (!result)
                return NotFound("Mahalle bulunamadı.");

            return Ok("Mahalle başarıyla güncellendi.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _mahalleService.DeleteAsync(id);

            if (!result)
                return NotFound("Mahalle bulunamadı.");

            return Ok("Mahalle başarıyla silindi.");
        }
    }
}
