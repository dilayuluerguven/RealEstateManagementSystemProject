using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(int id);
        Task<bool> CreateUserAsync(UserForRegisterDto dto);
        Task<bool> UpdateUserAsync(int id, UserForRegisterDto dto);
        Task<bool> DeleteUserAsync(int id);
    }
}
