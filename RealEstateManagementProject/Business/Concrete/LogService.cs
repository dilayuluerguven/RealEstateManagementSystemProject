using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;

namespace RealEstateManagementProject.Business.Concrete
{
    public class LogService : ILogService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public LogService(
            ApplicationDbContext context,
            IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<LogFilterDTO>> GetAllAsync()
        {
            return await _context.Loglar
                .OrderByDescending(x => x.Tarih)
                .Select(log => new LogFilterDTO
                {
                    UserId = log.UserId,
                    Durum = log.Durum,
                    IslemTipi = log.IslemTipi,
                    Aciklama = log.Aciklama,
                    Tarih = log.Tarih,
                    IpAdresi = log.IpAdresi
                })
                .ToListAsync();
        }

        public async Task<bool> AddAsync(Log log)
        {
            try
            {
                log.IpAdresi ??=
                    _httpContextAccessor.HttpContext?
                        .Connection?
                        .RemoteIpAddress?
                        .ToString() ?? "UNKNOWN";

                await _context.Loglar.AddAsync(log);
                await _context.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }


    }
}
