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
        public async Task<List<TasinmazListDto>> GetAllAsync(int? userId)
        {
            var query = _context.Tasinmazlar
                .AsNoTracking()
                .Include(x => x.Il)
                .Include(x => x.Ilce)
                .Include(x => x.Mahalle)
                .Include(x => x.User)
                .AsQueryable();

            if (userId.HasValue)
                query = query.Where(x => x.UserId == userId.Value);

            return await query
                .Select(x => new TasinmazListDto
                {
                    Id = x.Id,
                    UserId = x.UserId,
                    AdSoyad = x.User.AdSoyad,

                    IlId = x.IlId,
                    IlceId = x.IlceId,
                    MahalleId = x.MahalleId,

                    IlAdi = x.Il.IlAdi,
                    IlceAdi = x.Ilce.IlceAdi,
                    MahalleAdi = x.Mahalle.MahalleAdi,

                    Ada = x.Ada,
                    Parsel = x.Parsel,
                    Adres = x.Adres,
                    EmlakTipi = x.EmlakTipi,
                    Koordinat = x.Koordinat,
                    OlusturmaTarihi = x.OlusturmaTarihi
                })
                .ToListAsync();
        }
        public async Task<TasinmazCreateUpdateDto?> GetByIdAsync(int id, int userId, bool isAdmin)
        {
            var tasinmaz = isAdmin
                ? await _context.Tasinmazlar.FirstOrDefaultAsync(x => x.Id == id)
                : await _context.Tasinmazlar.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

            if (tasinmaz == null)
                return null;

            return new TasinmazCreateUpdateDto
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
        public async Task<bool> AddAsync(TasinmazCreateUpdateDto dto)
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
                    Koordinat = dto.Koordinat,
                    OlusturmaTarihi = DateTime.UtcNow
                };

                await _context.Tasinmazlar.AddAsync(tasinmaz);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    UserId = dto.UserId,
                    IslemTipi = "CREATE",
                    Durum = "Başarılı",
                    Aciklama = "Taşınmaz başarıyla eklendi"
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    UserId = dto.UserId,
                    IslemTipi = "CREATE",
                    Durum = "Hata",
                    Aciklama = "Taşınmaz eklenemedi"
                });

                return false;
            }
        }
        public async Task<bool> UpdateAsync(int id, TasinmazCreateUpdateDto dto, bool isAdmin)
        {
            try
            {
                var tasinmaz = isAdmin
                    ? await _context.Tasinmazlar.FirstOrDefaultAsync(x => x.Id == id)
                    : await _context.Tasinmazlar.FirstOrDefaultAsync(x => x.Id == id && x.UserId == dto.UserId);

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
                    UserId = dto.UserId,
                    IslemTipi = "UPDATE",
                    Durum = "Başarılı",
                    Aciklama = $"Taşınmaz başarıyla güncellendi (Id={id})"
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    UserId = dto.UserId,
                    IslemTipi = "UPDATE",
                    Durum = "Hata",
                    Aciklama = $"Taşınmaz güncellenemedi (Id={id})"
                });

                return false;
            }
        }
        public async Task<bool> DeleteAsync(int id, int userId, bool isAdmin)
        {
            try
            {
                var tasinmaz = isAdmin
                    ? await _context.Tasinmazlar.FirstOrDefaultAsync(x => x.Id == id)
                    : await _context.Tasinmazlar.FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

                if (tasinmaz == null)
                    return false;

                _context.Tasinmazlar.Remove(tasinmaz);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    UserId = userId,
                    IslemTipi = "DELETE",
                    Durum = "Başarılı",
                    Aciklama = $"Taşınmaz başarıyla silindi (Id={id})"
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    UserId = userId,
                    IslemTipi = "DELETE",
                    Durum = "Hata",
                    Aciklama = $"Taşınmaz silinemedi (Id={id})"
                });

                return false;
            }
        }
    }
}
