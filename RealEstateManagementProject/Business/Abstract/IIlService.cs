using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IIlService
    {
        Task<List<IlDto>> GetAllAsync();
    }
}
