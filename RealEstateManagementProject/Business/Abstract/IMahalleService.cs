using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IMahalleService
    {
        Task<List<MahalleDto>> GetAllAsync();
        Task<MahalleDto?> GetByIdAsync(int id);
        Task<bool> AddAsync(MahalleDto mahalleDto);
        Task<bool> UpdateAsync(int id, MahalleDto mahalleDto);
        Task<bool> DeleteAsync(int id);
    }
}
