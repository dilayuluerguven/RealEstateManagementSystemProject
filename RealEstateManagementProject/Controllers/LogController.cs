using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _logService.GetAllAsync();
            return Ok(logs);
        }
        [HttpPost("filter")]
        public async Task<IActionResult> Filter([FromBody] LogFilterDto filter)
        {
            var logs = await _logService.FilterAsync(filter);
            return Ok(logs);
        }
    }
}
