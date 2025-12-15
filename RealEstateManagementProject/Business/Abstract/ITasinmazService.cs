using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface ITasinmazService
    {
        Task<List<TasinmazDto>> GetAllAsync(int? userId);
        Task<TasinmazDto?> GetByIdAsync(int id, int userId);
        Task<bool> AddAsync(TasinmazDto dto);
        Task<bool> UpdateAsync(int id, TasinmazDto dto);
        Task<bool> DeleteAsync(int id, int userId);
    }
}
