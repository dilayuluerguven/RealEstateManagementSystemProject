using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using System.Security.Claims;

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
                    Id = log.Id,
                    UserId = log.UserId,
                    Durum = log.Durum,
                    IslemTipi = log.IslemTipi,
                    Aciklama = log.Aciklama,
                    Tarih = log.Tarih,
                    IpAdresi = log.IpAdresi
                })
                .ToListAsync();
        }
        private int? GetUserIdFromToken()
        {
            var userIdClaim = _httpContextAccessor.HttpContext?
                .User?
                .Claims?
                .FirstOrDefault(x => x.Type == "UserId" || x.Type == ClaimTypes.NameIdentifier);

            return userIdClaim != null ? int.Parse(userIdClaim.Value) : null;
        }


        public async Task<bool> AddAsync(Log log)
        {
            try
            {
                if (log.UserId == 0)
                {
                    var userId = GetUserIdFromToken();
                    if (userId.HasValue)
                        log.UserId = userId.Value;
                }

                log.IpAdresi ??=
                    _httpContextAccessor.HttpContext?
                        .Connection?
                        .RemoteIpAddress?
                        .ToString() ?? "UNKNOWN";

                log.Tarih = DateTime.Now;

                await _context.Loglar.AddAsync(log);
                await _context.SaveChangesAsync();

                return true;
            }
            catch
            {
                return false;
            }
        }
        public async Task<List<LogFilterDTO>> FilterAsync(LogFilterDTO filter)
        {
            IQueryable<Log> query = _context.Loglar;

            if (filter.UserId.HasValue)
                query = query.Where(x => x.UserId == filter.UserId);

            if (!string.IsNullOrEmpty(filter.Durum))
                query = query.Where(x => x.Durum.Contains(filter.Durum));

            if (!string.IsNullOrEmpty(filter.IslemTipi))
                query = query.Where(x => x.IslemTipi.Contains(filter.IslemTipi));

            if (!string.IsNullOrEmpty(filter.Aciklama))
                query = query.Where(x => x.Aciklama.Contains(filter.Aciklama));

            if (filter.Tarih.HasValue)
                query = query.Where(x => x.Tarih.Date == filter.Tarih.Value.Date);

            if (!string.IsNullOrEmpty(filter.IpAdresi))
                query = query.Where(x => x.IpAdresi.Contains(filter.IpAdresi));

            return await query
                .OrderByDescending(x => x.Tarih)
                .Select(log => new LogFilterDTO
                {
                    Id = log.Id,
                    UserId = log.UserId,
                    Durum = log.Durum,
                    IslemTipi = log.IslemTipi,
                    Aciklama = log.Aciklama,
                    Tarih = log.Tarih,
                    IpAdresi = log.IpAdresi
                })
                .ToListAsync();
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var log = await _context.Loglar.FindAsync(id);

            if (log == null)
                return false;

            _context.Loglar.Remove(log);
            await _context.SaveChangesAsync();

            return true;
        }




    }
}
