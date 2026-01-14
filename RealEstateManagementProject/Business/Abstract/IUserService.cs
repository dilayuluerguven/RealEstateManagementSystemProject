using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto> GetUserByIdAsync(int id);
        Task<bool> CreateUserAsync(UserForRegisterDto dto, int actorUserId);
        Task<bool> UpdateUserAsync(int targetUserId, UserUpdateDto dto, int actorUserId);
        Task<bool> DeleteUserAsync(int targetUserId, int actorUserId);

    }
}
