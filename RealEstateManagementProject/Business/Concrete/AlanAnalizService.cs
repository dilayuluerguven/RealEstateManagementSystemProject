using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using NetTopologySuite.Features;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;

public class AlanAnalizService : IAlanAnalizService
{
    private readonly ApplicationDbContext _context;
    private readonly GeoJsonReader _reader = new GeoJsonReader();
    private readonly GeoJsonWriter _writer = new GeoJsonWriter();

    public AlanAnalizService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AlanAnalizSonucDto> KaydetAsync(int userId, AlanAnalizCreateDto dto)
    {
        FeatureCollection fc;

        try
        {
            fc = _reader.Read<FeatureCollection>(dto.GeometriJson);
        }
        catch
        {
            throw new Exception("Geçersiz GeoJSON formatı (FeatureCollection bekleniyor).");
        }

        if (fc.Count == 0)
            throw new Exception("FeatureCollection içinde feature yok!");

        var geom = fc[0].Geometry;
        geom.SRID = 4326;

        var kayit = new AlanAnaliz
        {
            KullaniciId = userId,
            GeometriAdi = dto.GeometriAdi,
            GeometriJson = dto.GeometriJson,
            AnalizTuru = "ORIJINAL",
            AlanMetrekare = geom.Area,
            OlusturmaTarihi = DateTime.UtcNow
        };

        _context.AlanAnalizleri.Add(kayit);
        await _context.SaveChangesAsync();

        return new AlanAnalizSonucDto
        {
            GeometriAdi = kayit.GeometriAdi,
            GeometriJson = kayit.GeometriJson,
            AlanMetrekare = kayit.AlanMetrekare
        };
    }

    public async Task<Geometry?> GetGeometryAsync(int userId, string name)
    {
        var geo = await _context.AlanAnalizleri
            .Where(x => x.KullaniciId == userId && x.GeometriAdi == name)
            .OrderByDescending(x => x.Id)
            .FirstOrDefaultAsync();

        if (geo == null)
            return null;

        var fc = _reader.Read<FeatureCollection>(geo.GeometriJson);
        if (fc.Count == 0)
            return null;

        return fc[0].Geometry;
    }


    public async Task<Geometry?> KesisimAsync(int userId, string a, string b)
    {
        var g1 = await GetGeometryAsync(userId, a);
        var g2 = await GetGeometryAsync(userId, b);

        if (g1 == null || g2 == null)
            return null;

        g1.SRID = 4326;
        g2.SRID = 4326;

        var intersection = g1.Intersection(g2);
        return intersection.IsEmpty ? null : intersection;
    }

    public async Task<AlanAnalizSonucDto> BirlesimABAsync(int userId)
    {
        var A = await GetGeometryAsync(userId, "A");
        var B = await GetGeometryAsync(userId, "B");

        if (A == null || B == null)
            throw new Exception("A veya B bulunamadı!");

        A.SRID = 4326;
        B.SRID = 4326;

        var union = A.Union(B);

        var json = _writer.Write(union);

        var kayit = new AlanAnaliz
        {
            KullaniciId = userId,
            GeometriAdi = $"D-{Guid.NewGuid().ToString()[..6]}",
            AnalizTuru = "UNION A+B",
            GeometriJson = json,
            AlanMetrekare = union.Area,
            OlusturmaTarihi = DateTime.UtcNow
        };

        _context.AlanAnalizleri.Add(kayit);
        await _context.SaveChangesAsync();

        return new AlanAnalizSonucDto
        {
            GeometriAdi = kayit.GeometriAdi,
            GeometriJson = kayit.GeometriJson,
            AlanMetrekare = kayit.AlanMetrekare
        };
    }

    public async Task<AlanAnalizSonucDto> BirlesimABCAsync(int userId)
    {
        var A = await GetGeometryAsync(userId, "A");
        var B = await GetGeometryAsync(userId, "B");
        var C = await GetGeometryAsync(userId, "C");

        if (A == null || B == null || C == null)
            throw new Exception("A, B veya C bulunamadı");

        var union = A.Union(B).Union(C);

        var kayit = new AlanAnaliz
        {
            KullaniciId = userId,
            GeometriAdi = $"E-{Guid.NewGuid().ToString()[..6]}",
            AnalizTuru = "UNION A+B+C",
            GeometriJson = _writer.Write(union),
            AlanMetrekare = union.Area,
            OlusturmaTarihi = DateTime.UtcNow
        };

        _context.AlanAnalizleri.Add(kayit);
        await _context.SaveChangesAsync();

        return new AlanAnalizSonucDto
        {
            GeometriAdi = kayit.GeometriAdi,
            GeometriJson = kayit.GeometriJson,
            AlanMetrekare = kayit.AlanMetrekare
        };
    }
}
