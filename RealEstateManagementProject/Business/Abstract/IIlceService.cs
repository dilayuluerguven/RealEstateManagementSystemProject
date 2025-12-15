using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IIlceService
    {
        Task<List<IlceDto>> GetByIlIdAsync(int ilId);
    }
}
