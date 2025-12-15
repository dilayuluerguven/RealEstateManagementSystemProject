using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class IlceController : ControllerBase
{
    private readonly IIlceService _ilceService;

    public IlceController(IIlceService ilceService)
    {
        _ilceService = ilceService;
    }

    [HttpGet("getIlceByIlId/{ilId}")]
    public async Task<IActionResult> GetIlcelerByIl(int ilId)
    {
        var result = await _ilceService.GetByIlIdAsync(ilId);
        return Ok(result);
    }
}
