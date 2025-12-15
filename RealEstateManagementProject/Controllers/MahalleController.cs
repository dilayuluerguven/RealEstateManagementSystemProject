using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MahalleController : ControllerBase
    {
        private readonly IMahalleService _mahalleService;

        public MahalleController(IMahalleService mahalleService)
        {
            _mahalleService = mahalleService;
        }

        [HttpGet("getMahalleByIlceId/{ilceId}")]
        public async Task<IActionResult> GetMahallelerByIlce(int ilceId)
        {
            var result = await _mahalleService.GetByIlceIdAsync(ilceId);
            return Ok(result);
        }
    }
}

