using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IMahalleService
    {
        Task<List<MahalleDto>> GetByIlceIdAsync(int ilceId);
    }
}
