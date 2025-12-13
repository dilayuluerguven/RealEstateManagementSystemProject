using RealEstateManagementProject.Entities;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface ILogService
    {
        Task<List<Log>> GetAllAsync();
        Task<bool> AddAsync(Log log);
    }
}
