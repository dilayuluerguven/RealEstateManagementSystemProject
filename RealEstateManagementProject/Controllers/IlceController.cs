using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IlceController : ControllerBase
    {
        private readonly IIlceService _ilceService;

        public IlceController(IIlceService ilceService)
        {
            _ilceService = ilceService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _ilceService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _ilceService.GetByIdAsync(id);

            if (result == null)
                return NotFound("İlçe bulunamadı.");
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Add(IlceDto dto)
        {
            var result = await _ilceService.AddAsync(dto);

            if (!result)
                return BadRequest("İlçe eklenemedi.");

            return Ok("İlçe başarıyla eklendi.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, IlceDto dto)
        {
            var result = await _ilceService.UpdateAsync(id, dto);

            if (!result)
                return NotFound("İlçe bulunamadı.");

            return Ok("İlçe başarıyla güncellendi.");
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _ilceService.DeleteAsync(id);

            if (!result)
                return NotFound("İlçe bulunamadı.");

            return Ok("İlçe başarıyla silindi.");
        }
    }
}
