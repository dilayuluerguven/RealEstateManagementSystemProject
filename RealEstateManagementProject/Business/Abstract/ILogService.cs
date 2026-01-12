using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface ILogService
    {
        Task<List<LogFilterDTO>> GetAllAsync();
        Task<List<LogFilterDTO>> FilterAsync(LogFilterDTO filter);
        Task<bool> AddAsync(Log log);
        Task<bool> DeleteAsync(int id);

    }
}
