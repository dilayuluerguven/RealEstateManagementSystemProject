using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface ITasinmazService
    {
        Task<List<TasinmazListDto>> GetAllAsync(int? userId);
        Task<TasinmazCreateUpdateDto?> GetByIdAsync(int id, int userId, bool isAdmin);
        Task<bool> AddAsync(TasinmazCreateUpdateDto dto);
        Task<bool> UpdateAsync(int id, TasinmazCreateUpdateDto dto,bool isAdmin);
        Task<bool> DeleteAsync(int id, int userId,bool isAdmin);
    }
}
