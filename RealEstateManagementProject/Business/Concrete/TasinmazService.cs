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

        private async Task<string> GetUserNameAsync(int userId)
        {
            return await _context.Users
                .Where(u => u.Id == userId)
                .Select(u => u.AdSoyad)
                .FirstOrDefaultAsync()
                ?? "Bilinmeyen Kullanıcı";
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

            return await query.Select(x => new TasinmazListDto
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
            }).ToListAsync();
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
            var userName = await GetUserNameAsync(dto.UserId);

            try
            {
                byte[]? imageBytes = null;
                string? contentType = null;

                if (dto.Image != null && dto.Image.Length > 0)
                {
                    using var ms = new MemoryStream();
                    await dto.Image.CopyToAsync(ms);
                    imageBytes = ms.ToArray();
                    contentType = dto.Image.ContentType;
                }

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
                    OlusturmaTarihi = DateTime.UtcNow,
                    ImageData = imageBytes,
                    ImageContentType = contentType
                };

                await _context.Tasinmazlar.AddAsync(tasinmaz);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    UserId = dto.UserId,
                    IslemTipi = "Create",
                    Durum = "Success",
                    Aciklama = $"{userName} taşınmaz ekledi"
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    UserId = dto.UserId,
                    IslemTipi = "Create",
                    Durum = "Error",
                    Aciklama = $"{userName} taşınmaz ekleyemedi"
                });

                return false;
            }
        }

        public async Task<bool> UpdateAsync(int id, TasinmazCreateUpdateDto dto, bool isAdmin)
        {
            string userName = "Bilinmeyen Kullanıcı";

            try
            {
                var tasinmaz = isAdmin
                    ? await _context.Tasinmazlar.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id)
                    : await _context.Tasinmazlar.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id && x.UserId == dto.UserId);

                if (tasinmaz == null)
                    return false;

                userName = tasinmaz.User?.AdSoyad ?? userName;

                tasinmaz.IlId = dto.IlId;
                tasinmaz.IlceId = dto.IlceId;
                tasinmaz.MahalleId = dto.MahalleId;
                tasinmaz.Ada = dto.Ada;
                tasinmaz.Parsel = dto.Parsel;
                tasinmaz.Adres = dto.Adres;
                tasinmaz.EmlakTipi = dto.EmlakTipi;
                tasinmaz.Koordinat = dto.Koordinat;

                if (dto.Image != null && dto.Image.Length > 0)
                {
                    using var ms = new MemoryStream();
                    await dto.Image.CopyToAsync(ms);
                    tasinmaz.ImageData = ms.ToArray();
                    tasinmaz.ImageContentType = dto.Image.ContentType;
                }

                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    UserId = tasinmaz.UserId,
                    IslemTipi = "Update",
                    Durum = "Success",
                    Aciklama = $"{userName} taşınmaz güncelledi (Id={id})"
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    UserId = dto.UserId,
                    IslemTipi = "Update",
                    Durum = "Error",
                    Aciklama = $"{userName} taşınmaz güncelleyemedi (Id={id})"
                });

                return false;
            }
        }

        public async Task<bool> DeleteAsync(int id, int userId, bool isAdmin)
        {
            string userName = await GetUserNameAsync(userId);

            try
            {
                var tasinmaz = isAdmin
                    ? await _context.Tasinmazlar.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id)
                    : await _context.Tasinmazlar.Include(x => x.User).FirstOrDefaultAsync(x => x.Id == id && x.UserId == userId);

                if (tasinmaz == null)
                    return false;

                userName = tasinmaz.User?.AdSoyad ?? userName;

                _context.Tasinmazlar.Remove(tasinmaz);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    UserId = tasinmaz.UserId,
                    IslemTipi = "Delete",
                    Durum = "Success",
                    Aciklama = $"{userName} taşınmaz sildi (Id={id})"
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    UserId = userId,
                    IslemTipi = "Delete",
                    Durum = "Error",
                    Aciklama = $"{userName} taşınmaz silemedi (Id={id})"
                });

                return false;
            }
        }
        public async Task<(byte[] Data, string ContentType)?> GetImageAsync(int id)
        {
            var t = await _context.Tasinmazlar
                .AsNoTracking()
                .Where(x => x.Id == id)
                .Select(x => new { x.ImageData, x.ImageContentType })
                .FirstOrDefaultAsync();

            if (t == null || t.ImageData == null)
                return null;

            return (t.ImageData, t.ImageContentType ?? "image/jpeg");
        }

    }
}
