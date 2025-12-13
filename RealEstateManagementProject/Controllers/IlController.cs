using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class IlController : ControllerBase
    {
        private readonly IIlService _ilService;

        public IlController(IIlService ilService)
        {
            _ilService = ilService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _ilService.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _ilService.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }
        [HttpPost]
        public async Task<IActionResult> Add(IlDto dto)
        {
            var result = await _ilService.AddAsync(dto);

            if (!result)
                return BadRequest("İl eklenemedi.");

            return Ok( "İl başarıyla eklendi.");
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, IlDto dto)
        {
            var result = await _ilService.UpdateAsync(id, dto);

            if (!result)
                return NotFound("İl bulunamadı.");

            return Ok("İl başarıyla güncellendi.");
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var result=await _ilService.DeleteAsync(id);
            if (!result)
                return NotFound("İl bulunamadı.");
            return Ok("İl başarıyla silindi");
        }
    }
}
