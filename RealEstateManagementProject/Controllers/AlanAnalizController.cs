using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Business.Abstract;
using System.Security.Claims;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AlanAnalizController : ControllerBase
    {
        private readonly IAlanAnalizService _service;

        public AlanAnalizController(IAlanAnalizService service)
        {
            _service = service;
        }

        private int GetKullaniciId()
        {
            var claim = User.Claims.FirstOrDefault(c =>
                c.Type == "UserId" || c.Type == ClaimTypes.NameIdentifier);

            if (claim == null)
                throw new UnauthorizedAccessException("Kullanıcı bulunamadı.");

            return int.Parse(claim.Value);
        }

        [HttpPost("kaydet")]
        public async Task<IActionResult> Kaydet([FromBody] AlanAnalizCreateDto dto)
        {
            int kullaniciId = GetKullaniciId();
            var sonuc = await _service.KaydetAsync(kullaniciId, dto);
            return Ok(new { success = true, data = sonuc });
        }

        [HttpGet("getir/{adi}")]
        public async Task<IActionResult> Getir(string adi)
        {
            int kullaniciId = GetKullaniciId();
            AlanAnalizSonucDto? sonuc = await _service.GetirAsync(kullaniciId, adi);

            if (sonuc is null)
                return Ok(new { success = false, data = (object?)null });

            return Ok(new { success = true, data = sonuc });
        }

        [HttpGet("liste")]
        public async Task<IActionResult> Liste()
        {
            int kullaniciId = GetKullaniciId();
            var list = await _service.ListeAsync(kullaniciId);
            return Ok(new { success = true, data = list });
        }

        [HttpDelete("sil/{id}")]
        public async Task<IActionResult> Sil(int id)
        {
            int kullaniciId = GetKullaniciId();
            bool sonuc = await _service.SilAsync(kullaniciId, id);
            return Ok(new { success = sonuc });
        }

        [HttpDelete("temizle/{adi}")]
        public async Task<IActionResult> Temizle(string adi)
        {
            int kullaniciId = GetKullaniciId();
            bool sonuc = await _service.GeometriyeGoreSilAsync(kullaniciId, adi);
            return Ok(new { success = sonuc });
        }
    }
}
