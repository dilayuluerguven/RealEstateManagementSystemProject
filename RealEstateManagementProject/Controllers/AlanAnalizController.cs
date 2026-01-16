using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlanAnalizController : ControllerBase
    {
        private readonly IAlanAnalizService _service;

        public AlanAnalizController(IAlanAnalizService service)
        {
            _service = service;
        }

        [HttpPost("geometri-kaydet")]
        public async Task<IActionResult> GeometriKaydet(
            [FromQuery] int kullaniciId,
            [FromBody] AlanAnalizCreateDto dto)
        {
            var sonuc = await _service.GeometriKaydetAsync(kullaniciId, dto);

            return Ok(new
            {
                success = sonuc,
                message = sonuc
                    ? "Geometri başarıyla kaydedildi."
                    : "Geometri kaydedilemedi.",
                data = (object?)null
            });
        }

        [HttpGet("geometriler")]
        public async Task<IActionResult> Geometriler(
            [FromQuery] int kullaniciId)
        {
            var liste = await _service.KayitliGeometrileriGetirAsync(kullaniciId);

            return Ok(new
            {
                success = true,
                message = "Geometriler başarıyla getirildi.",
                data = liste
            });
        }

        [HttpPost("kesisim")]
        public async Task<IActionResult> Kesisim(
            [FromQuery] int kullaniciId,
            [FromBody] AlanAnalizIslemDto dto)
        {
            var sonuc = await _service.KesisimHesaplaAsync(kullaniciId, dto);

            if (sonuc == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Kesişim bulunamadı.",
                    data = (object?)null
                });
            }

            return Ok(new
            {
                success = true,
                message = "Kesişim başarıyla hesaplandı.",
                data = sonuc
            });
        }

        [HttpPost("birlesim")]
        public async Task<IActionResult> Birlesim(
            [FromQuery] int kullaniciId,
            [FromBody] AlanAnalizIslemDto dto)
        {
            var sonuc = await _service.BirlesimHesaplaAsync(kullaniciId, dto);

            if (sonuc == null)
            {
                return Ok(new
                {
                    success = false,
                    message = "Birleşim işlemi gerçekleştirilemedi.",
                    data = (object?)null
                });
            }

            return Ok(new
            {
                success = true,
                message = "Birleşim işlemi başarıyla gerçekleştirildi.",
                data = sonuc
            });
        }

        [HttpGet("tum-analizler")]
        public async Task<IActionResult> TumAnalizler(
            [FromQuery] int kullaniciId)
        {
            var liste = await _service.TumAnalizleriGetirAsync(kullaniciId);

            return Ok(new
            {
                success = true,
                message = "Analiz geçmişi başarıyla getirildi.",
                data = liste
            });
        }
    }
}
