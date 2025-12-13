using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IIlService
    {
        Task<List<IlDto>> GetAllAsync();
        Task<IlDto?> GetByIdAsync(int id);
        Task<bool> AddAsync(IlDto ilDto);
        Task<bool> UpdateAsync(int id, IlDto ilDto);
        Task<bool> DeleteAsync(int id);
    }
}
