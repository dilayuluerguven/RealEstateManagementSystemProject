using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

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
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Id == kullaniciId);
        var adSoyad = user?.AdSoyad ?? "Kullanıcı";

        var mevcutEntity = await _context.AlanAnalizleri
            .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == dto.GeometriAdi);

        bool isUpdate = mevcutEntity != null;

        if (isUpdate)
        {
            mevcutEntity.AnalizTuru = dto.AnalizTuru;
            mevcutEntity.GeometriJson = dto.GeometriJson;
            mevcutEntity.AlanMetrekare = dto.AlanMetrekare;
            mevcutEntity.OlusturmaTarihi = DateTime.UtcNow;

            _context.AlanAnalizleri.Update(mevcutEntity);
        }
        else
        {
            var yeniEntity = new AlanAnaliz
            {
                KullaniciId = kullaniciId,
                GeometriAdi = dto.GeometriAdi,
                AnalizTuru = dto.AnalizTuru,
                GeometriJson = dto.GeometriJson,
                AlanMetrekare = dto.AlanMetrekare,
                OlusturmaTarihi = DateTime.UtcNow
            };

            _context.AlanAnalizleri.Add(yeniEntity);
        }

        await _context.SaveChangesAsync();

        var entity = mevcutEntity ??
                     await _context.AlanAnalizleri
                        .FirstAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == dto.GeometriAdi);

        string islemAdi = dto.AnalizTuru.ToLower() switch
        {
            "union" => "birleştirme (union)",
            "intersection" => "kesişim (intersection)",
            "difference" => "fark alma (difference)",
            "split" => "bölme (split)",
            "buffer" => "buffer işlemi",
            "area" => "alan hesabı",
            _ => dto.AnalizTuru.ToLower()
        };

        await _logService.AddAsync(new Log
        {
            UserId = kullaniciId,
            IslemTipi = isUpdate ? "Update" : "Create",
            Durum = "Success",
            Aciklama = isUpdate
                ? $"{adSoyad}, '{dto.GeometriAdi}' üzerinde {islemAdi} yaptı (güncellendi)"
                : $"{adSoyad}, '{dto.GeometriAdi}' üzerinde {islemAdi} yaptı",
            Tarih = DateTime.UtcNow
        });

        return new AlanAnalizSonucDto
        {
            GeometriAdi = entity.GeometriAdi,
            AnalizTuru = entity.AnalizTuru,
            Islem = dto.AnalizTuru,
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
            IslemTipi = "Delete",
            Durum = "Success",
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
            IslemTipi = "Delete",
            Durum = "Success",
            Aciklama = $"{adSoyad}, '{geometriAdi}' alan analizini sildi",
            Tarih = DateTime.UtcNow
        });

        return true;
    }
}
