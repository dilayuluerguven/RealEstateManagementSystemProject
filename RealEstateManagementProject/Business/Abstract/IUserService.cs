using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IUserService
    {
        Task<List<UserDTO>> GetAllUsersAsync();
        Task<UserDTO> GetUserByIdAsync(int id);
        Task<bool> CreateUserAsync(UserForRegisterDto dto);
        Task<bool> UpdateUserAsync(int id, UserForRegisterDto dto);
        Task<bool> DeleteUserAsync(int id);
    }
}
