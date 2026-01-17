using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Dtos;
using System.Security.Claims;
using NetTopologySuite.IO;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AlanAnalizController : ControllerBase
{
    private readonly IAlanAnalizService _service;
    private readonly GeoJsonWriter _writer = new GeoJsonWriter();

    public AlanAnalizController(IAlanAnalizService service)
    {
        _service = service;
    }

    private int GetUserId()
    {
        var claim = User?.Claims?.FirstOrDefault(c =>
            c.Type == "UserId" || c.Type == ClaimTypes.NameIdentifier);

        if (claim == null)
            throw new UnauthorizedAccessException("UserId bulunamadı!");

        return int.Parse(claim.Value);
    }

    [HttpPost("geometri-kaydet")]
    public async Task<IActionResult> GeometriKaydet([FromBody] AlanAnalizCreateDto dto)
    {
        int userId = GetUserId();
        var result = await _service.KaydetAsync(userId, dto);

        return Ok(new
        {
            success = true,
            message = $"{dto.GeometriAdi} kaydedildi.",
            data = result
        });
    }

    [HttpPost("kesisim")]
    public async Task<IActionResult> Kesisim([FromBody] AlanAnalizIslemDto dto)
    {
        int userId = GetUserId();
        var geometry = await _service.KesisimAsync(userId, dto.A, dto.B);

        if (geometry == null)
            return Ok(new { success = false, message = "Kesişim yok." });

        return Ok(new
        {
            success = true,
            geoJson = _writer.Write(geometry),
            area = geometry.Area
        });
    }

    [HttpPost("birlesim-ab")]
    public async Task<IActionResult> BirlesimAB()
    {
        int userId = GetUserId();
        var result = await _service.BirlesimABAsync(userId);

        return Ok(new
        {
            success = true,
            data = result
        });
    }

    [HttpPost("birlesim-abc")]
    public async Task<IActionResult> BirlesimABC()
    {
        int userId = GetUserId();
        var result = await _service.BirlesimABCAsync(userId);

        return Ok(new
        {
            success = true,
            data = result
        });
    }
}
