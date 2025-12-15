using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class TasinmazService : ITasinmazService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public TasinmazService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;
        }

        public async Task<List<TasinmazDto>> GetAllAsync(int? userId)
        {
            var query = _context.Tasinmazlar.AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(x => x.UserId == userId.Value);
            }

            return await query
                .Select(x => new TasinmazDto
                {
                    Id = x.Id,
                    IlId = x.IlId,
                    IlceId = x.IlceId,
                    MahalleId = x.MahalleId,
                    UserId = x.UserId,
                    Ada = x.Ada,
                    Parsel = x.Parsel,
                    Adres = x.Adres,
                    EmlakTipi = x.EmlakTipi,
                    Koordinat = x.Koordinat
                })
                .ToListAsync();
        }

        public async Task<TasinmazDto?> GetByIdAsync(int id, int userId)
        {
            var tasinmaz = await _context.Tasinmazlar
                .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (tasinmaz == null)
                return null;

            return new TasinmazDto
            {
                Id = tasinmaz.Id,
                IlId = tasinmaz.IlId,
                IlceId = tasinmaz.IlceId,
                MahalleId = tasinmaz.MahalleId,
                UserId = tasinmaz.UserId,
                Ada = tasinmaz.Ada,
                Parsel = tasinmaz.Parsel,
                Adres = tasinmaz.Adres,
                EmlakTipi = tasinmaz.EmlakTipi,
                Koordinat = tasinmaz.Koordinat
            };
        }
        public async Task<bool> AddAsync(TasinmazDto dto)
        {
            try
            {
                var tasinmaz = new Tasinmaz
                {
                    IlId = dto.IlId,
                    IlceId = dto.IlceId,
                    MahalleId = dto.MahalleId,
                    UserId = dto.UserId,
                    Ada = dto.Ada,
                    Parsel = dto.Parsel,
                    Adres = dto.Adres,
                    EmlakTipi = dto.EmlakTipi,
                    Koordinat = dto.Koordinat
                };

                await _context.Tasinmazlar.AddAsync(tasinmaz);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "SUCCESS",
                    Aciklama = $"Taşınmaz eklendi (UserId={dto.UserId})",
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
                    Aciklama = "Taşınmaz eklenemedi",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> UpdateAsync(int id, TasinmazDto dto)
        {
            try
            {
                var tasinmaz = await _context.Tasinmazlar
                    .FirstOrDefaultAsync(x => x.Id == id && x.UserId == dto.UserId);

                if (tasinmaz == null)
                    return false;

                tasinmaz.IlId = dto.IlId;
                tasinmaz.IlceId = dto.IlceId;
                tasinmaz.MahalleId = dto.MahalleId;
                tasinmaz.Ada = dto.Ada;
                tasinmaz.Parsel = dto.Parsel;
                tasinmaz.Adres = dto.Adres;
                tasinmaz.EmlakTipi = dto.EmlakTipi;
                tasinmaz.Koordinat = dto.Koordinat;

                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "SUCCESS",
                    Aciklama = $"Taşınmaz güncellendi (Id={id}, UserId={dto.UserId})",
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
                    Aciklama = $"Taşınmaz güncellenemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
        public async Task<bool> DeleteAsync(int id, int userId)
        {
            try
            {
                var tasinmaz = await _context.Tasinmazlar
                    .FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

                if (tasinmaz == null)
                    return false;

                _context.Tasinmazlar.Remove(tasinmaz);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "SUCCESS",
                    Aciklama = $"Taşınmaz silindi (Id={id}, UserId={userId})",
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
                    Aciklama = $"Taşınmaz silinemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }
    }
}
