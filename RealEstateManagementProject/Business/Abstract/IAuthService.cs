using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IAuthService
    {
        Task<UserDto?> LoginAsync(UserForLoginDto loginDto, string ipAddress);

        Task<bool> RegisterAsync(UserForRegisterDto registerDto, string ipAddress);
    }
}
