using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        public UserService(ApplicationDbContext context)
        {
            _context = context;
        }
        public Task<List<UserDTO>> GetAllUsersAsync()
        {
            throw new NotImplementedException();
        }
        public Task<UserDTO> GetUserByIdAsync(int id) {
            throw new NotImplementedException(); 
        }
        public Task<bool>CreateUserAsync(UserForRegisterDto dto)
        {
            throw new NotImplementedException();
        }
        public Task<bool> UpdateUserAsync(int id, UserForRegisterDto dto)
        {
            throw new NotImplementedException(); 
        }
        public Task<bool> DeleteUserAsync(int id)
        {
            throw new NotImplementedException();
        }


    }
}
