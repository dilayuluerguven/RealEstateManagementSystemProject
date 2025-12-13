using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IIlceService
    {
        Task<List<IlceDto>> GetAllAsync();
        Task<IlceDto?> GetByIdAsync(int id);
        Task<bool> AddAsync(IlceDto ilceDto);
        Task<bool> UpdateAsync(int id, IlceDto ilceDto);
        Task<bool> DeleteAsync(int id);
    }
}
