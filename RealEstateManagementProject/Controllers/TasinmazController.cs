using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class TasinmazController : ControllerBase
    {
        private readonly ITasinmazService _tasinmazService;

        public TasinmazController(ITasinmazService tasinmazService)
        {
            _tasinmazService = tasinmazService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _tasinmazService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _tasinmazService.GetByIdAsync(id);

            if (result == null)
                return NotFound("Taşınmaz bulunamadı.");

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Add(TasinmazDto dto)
        {
            var result = await _tasinmazService.AddAsync(dto);

            if (!result)
                return BadRequest("Taşınmaz eklenemedi.");

            return Ok("Taşınmaz başarıyla eklendi.");
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, TasinmazDto dto)
        {
            var result = await _tasinmazService.UpdateAsync(id, dto);

            if (!result)
                return NotFound("Taşınmaz bulunamadı.");

            return Ok("Taşınmaz başarıyla güncellendi.");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _tasinmazService.DeleteAsync(id);

            if (!result)
                return NotFound("Taşınmaz bulunamadı.");

            return Ok("Taşınmaz başarıyla silindi.");
        }
    }
}
