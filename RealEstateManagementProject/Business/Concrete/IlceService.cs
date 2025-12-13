using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class IlceService : IIlceService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public IlceService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;
        }

        public async Task<List<IlceDto>> GetAllAsync()
        {
            return await _context.Ilceler
                .Select(x => new IlceDto
                {
                    Id = x.Id,
                    IlceAdi = x.IlceAdi,
                    IlId = x.IlId
                }).ToListAsync();
        }

        public async Task<IlceDto?> GetByIdAsync(int id)
        {
            var ilce = await _context.Ilceler.FindAsync(id);

            if (ilce == null)
                return null;

            var result = new IlceDto
            {
                Id=ilce.Id,
                IlceAdi=ilce.IlceAdi,
                IlId=ilce.IlId
            };
            return result;
        }
        public async Task<bool> AddAsync(IlceDto dto)
        {
            try
            {
                var ilce = new Ilce
                {
                    IlceAdi = dto.IlceAdi,
                    IlId = dto.IlId
                };

                await _context.Ilceler.AddAsync(ilce);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "SUCCESS",
                    Aciklama = $"İlçe eklendi: {dto.IlceAdi}",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "ERROR",
                    Aciklama = $"İlçe eklenemedi: {dto.IlceAdi}",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> UpdateAsync(int id, IlceDto dto)
        {
            try
            {
                var ilce = await _context.Ilceler.FirstOrDefaultAsync(x => x.Id == id);
                if (ilce == null)
                    return false;

                ilce.IlceAdi = dto.IlceAdi;
                ilce.IlId = dto.IlId;

                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "SUCCESS",
                    Aciklama = $"İlçe güncellendi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "ERROR",
                    Aciklama = $"İlçe güncellenemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var ilce = await _context.Ilceler.FindAsync(id);
                if (ilce == null)
                    return false;

                _context.Ilceler.Remove(ilce);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "SUCCESS",
                    Aciklama = $"İlçe silindi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "ERROR",
                    Aciklama = $"İlçe silinemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }

    }
}
