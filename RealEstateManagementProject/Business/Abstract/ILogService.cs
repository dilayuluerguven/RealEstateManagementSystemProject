using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface ILogService
    {
        Task<List<LogFilterDto>> GetAllAsync();
        Task<List<LogFilterDto>> FilterAsync(LogFilterDto filter);
        Task<bool> AddAsync(Log log);
    }
}
