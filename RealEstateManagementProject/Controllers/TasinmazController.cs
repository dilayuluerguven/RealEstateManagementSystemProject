using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities.Concrete;
using System.Security.Claims;

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

    private bool TryGetUserId(out int userId)
    {
        userId = 0;
        var claim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (claim == null) return false;

        return int.TryParse(claim.Value, out userId);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        if (User.IsInRole("Admin"))
        {
            var result = await _tasinmazService.GetAllAsync(null);
            return Ok(result);
        }

        if (!TryGetUserId(out int userId))
            return Unauthorized();

        var userResult = await _tasinmazService.GetAllAsync(userId);
        return Ok(userResult);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized();

        bool isAdmin = User.IsInRole("Admin");

        var result = await _tasinmazService.GetByIdAsync(id, userId, isAdmin);

        if (result == null)
            return NotFound("Taşınmaz bulunamadı.");

        return Ok(result);
    }

    [HttpPost("add")]
    public async Task<IActionResult> Add([FromBody] TasinmazCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (!TryGetUserId(out int userId))
            return Unauthorized();

        dto.UserId = userId;

        var result = await _tasinmazService.AddAsync(dto);

        if (!result)
            return BadRequest();

        return Ok();
    }


    [HttpPut("update/{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] TasinmazCreateUpdateDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        if (!TryGetUserId(out int userId))
            return Unauthorized();

        dto.UserId = userId;
        bool isAdmin = User.IsInRole("Admin");

        var result = await _tasinmazService.UpdateAsync(id, dto,isAdmin);

        if (!result)
            return NotFound();

        return Ok();
    }


    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!TryGetUserId(out int userId))
            return Unauthorized();

        bool isAdmin = User.IsInRole("Admin");

        var result = await _tasinmazService.DeleteAsync(id, userId, isAdmin);

        if (!result)
            return NotFound();

        return Ok();
    }

}
