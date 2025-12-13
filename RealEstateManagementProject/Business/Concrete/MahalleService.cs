using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class MahalleService : IMahalleService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public MahalleService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;

        }

        public async Task<List<MahalleDto>> GetAllAsync()
        {
            return await _context.Mahalleler
                .Select(x => new MahalleDto
                {
                    Id = x.Id,
                    MahalleAdi = x.MahalleAdi,
                    IlceId = x.IlceId
                })
                .ToListAsync();
        }

        public async Task<MahalleDto?> GetByIdAsync(int id)
        {
            var mahalle = await _context.Mahalleler.FindAsync(id);

            if (mahalle == null)
                return null;

            return new MahalleDto
            {
                Id = mahalle.Id,
                MahalleAdi = mahalle.MahalleAdi,
                IlceId = mahalle.IlceId
            };
        }
        public async Task<bool> AddAsync(MahalleDto dto)
        {
            try
            {
                var mahalle = new Mahalle
                {
                    MahalleAdi = dto.MahalleAdi,
                    IlceId = dto.IlceId
                };

                await _context.Mahalleler.AddAsync(mahalle);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "SUCCESS",
                    Aciklama = $"Mahalle eklendi: {dto.MahalleAdi}",
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
                    Aciklama = $"Mahalle eklenemedi: {dto.MahalleAdi}",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> UpdateAsync(int id, MahalleDto dto)
        {
            try
            {
                var mahalle = await _context.Mahalleler.FirstOrDefaultAsync(x => x.Id == id);
                if (mahalle == null)
                    return false;

                mahalle.MahalleAdi = dto.MahalleAdi;
                mahalle.IlceId = dto.IlceId;

                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "SUCCESS",
                    Aciklama = $"Mahalle güncellendi (Id={id})",
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
                    Aciklama = $"Mahalle güncellenemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var mahalle = await _context.Mahalleler.FindAsync(id);
                if (mahalle == null)
                    return false;

                _context.Mahalleler.Remove(mahalle);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "SUCCESS",
                    Aciklama = $"Mahalle silindi (Id={id})",
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
                    Aciklama = $"Mahalle silinemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
    }
}
