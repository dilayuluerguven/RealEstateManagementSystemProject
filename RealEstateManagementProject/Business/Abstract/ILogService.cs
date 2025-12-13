using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface ILogService
    {
        Task<List<LogFilterDTO>> GetAllAsync();
        Task<bool> AddAsync(Log log);
    }
}
