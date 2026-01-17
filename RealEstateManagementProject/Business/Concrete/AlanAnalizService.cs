using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Business;

public class AlanAnalizService : IAlanAnalizService
{
    private readonly ApplicationDbContext _context;

    public AlanAnalizService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AlanAnalizSonucDto> KaydetAsync(int kullaniciId, AlanAnalizCreateDto dto)
    {
        var mevcutEntity = await _context.AlanAnalizleri
            .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == dto.GeometriAdi);

        if (mevcutEntity != null)
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

        var entity = mevcutEntity ?? await _context.AlanAnalizleri
            .FirstAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == dto.GeometriAdi);

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
        var entity = await _context.AlanAnalizleri
            .FirstOrDefaultAsync(x => x.Id == id && x.KullaniciId == kullaniciId);

        if (entity == null)
            return false;

        _context.AlanAnalizleri.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> GeometriyeGoreSilAsync(int kullaniciId, string geometriAdi)
    {
        var entity = await _context.AlanAnalizleri
            .FirstOrDefaultAsync(x => x.KullaniciId == kullaniciId && x.GeometriAdi == geometriAdi);

        if (entity == null)
            return false;

        _context.AlanAnalizleri.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}