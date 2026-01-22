using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class AlanAnalizService : IAlanAnalizService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogService _logService;

        public AlanAnalizService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;
        }

        public async Task<AlanAnalizSonucDto> KaydetAsync(int kullaniciId, AlanAnalizCreateDto dto)
        {
            var geometriAdi = dto.GeometriAdi ?? string.Empty;
            var analizTuru = dto.AnalizTuru ?? string.Empty;

            var mevcutEntity = await _context.AlanAnalizleri
                .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == geometriAdi);

            if (mevcutEntity is not null)
            {
                mevcutEntity.AnalizTuru = analizTuru;
                mevcutEntity.GeometriJson = dto.GeometriJson;
                mevcutEntity.AlanMetrekare = dto.AlanMetrekare ?? 0;
                mevcutEntity.OlusturmaTarihi = DateTime.UtcNow;

                _context.AlanAnalizleri.Update(mevcutEntity);
            }
            else
            {
                var yeniEntity = new AlanAnaliz
                {
                    KullaniciId = kullaniciId,
                    GeometriAdi = geometriAdi,
                    AnalizTuru = analizTuru,
                    GeometriJson = dto.GeometriJson,
                    AlanMetrekare = dto.AlanMetrekare ?? 0,
                    OlusturmaTarihi = DateTime.UtcNow
                };

                _context.AlanAnalizleri.Add(yeniEntity);
            }

            await _context.SaveChangesAsync();

            var entity = mevcutEntity ??
                         await _context.AlanAnalizleri
                             .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == geometriAdi)
                             ?? throw new InvalidOperationException("Alan analizi kaydedilemedi.");

            return new AlanAnalizSonucDto
            {
                GeometriAdi = entity.GeometriAdi,
                AnalizTuru = entity.AnalizTuru,
                Islem = analizTuru,
                GeometriJson = entity.GeometriJson,
                AlanMetrekare = entity.AlanMetrekare,
                OlusturmaTarihi = entity.OlusturmaTarihi
            };
        }

        public async Task<AlanAnalizSonucDto?> GetirAsync(int kullaniciId, string geometriAdi)
        {
            var entity = await _context.AlanAnalizleri
                .Where(x => x.KullaniciId == kullaniciId && x.GeometriAdi == geometriAdi)
                .OrderByDescending(x => x.Id)
                .FirstOrDefaultAsync();

            if (entity == null)
                return null;

            return new AlanAnalizSonucDto
            {
                GeometriAdi = entity.GeometriAdi,
                AnalizTuru = entity.AnalizTuru,
                Islem = entity.AnalizTuru,
                GeometriJson = entity.GeometriJson,
                AlanMetrekare = entity.AlanMetrekare,
                OlusturmaTarihi = entity.OlusturmaTarihi
            };
        }

        public async Task<List<AlanAnalizSonucDto>> ListeAsync(int kullaniciId)
        {
            var list = await _context.AlanAnalizleri
                .Where(x => x.KullaniciId == kullaniciId)
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            return list.Select(entity => new AlanAnalizSonucDto
            {
                GeometriAdi = entity.GeometriAdi,
                AnalizTuru = entity.AnalizTuru,
                Islem = entity.AnalizTuru,
                GeometriJson = entity.GeometriJson,
                AlanMetrekare = entity.AlanMetrekare,
                OlusturmaTarihi = entity.OlusturmaTarihi
            }).ToList();
        }

        public async Task<bool> SilAsync(int kullaniciId, int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == kullaniciId);
            var adSoyad = user?.AdSoyad ?? "Kullanıcı";

            var entity = await _context.AlanAnalizleri
                .FirstOrDefaultAsync(x => x.Id == id && x.KullaniciId == kullaniciId);

            if (entity == null)
                return false;

            _context.AlanAnalizleri.Remove(entity);
            await _context.SaveChangesAsync();

            await _logService.AddAsync(new Log
            {
                UserId = kullaniciId,
                IslemTipi = "delete",
                Durum = "success",
                Aciklama = $"{adSoyad}, '{entity.GeometriAdi}' alan analizini sildi",
                Tarih = DateTime.UtcNow
            });

            return true;
        }

        public async Task<bool> GeometriyeGoreSilAsync(int kullaniciId, string geometriAdi)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == kullaniciId);
            var adSoyad = user?.AdSoyad ?? "Kullanıcı";

            var entity = await _context.AlanAnalizleri
                .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == geometriAdi);

            if (entity == null)
                return false;

            _context.AlanAnalizleri.Remove(entity);
            await _context.SaveChangesAsync();

            await _logService.AddAsync(new Log
            {
                UserId = kullaniciId,
                IslemTipi = "delete",
                Durum = "success",
                Aciklama = $"{adSoyad}, '{geometriAdi}' alan analizini sildi",
                Tarih = DateTime.UtcNow
            });

            return true;
        }
    }
}
