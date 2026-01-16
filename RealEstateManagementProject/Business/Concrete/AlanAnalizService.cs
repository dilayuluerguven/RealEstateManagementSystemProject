using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
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
    public async Task<AlanAnaliz> KaydetAsync(int userId, AlanAnalizCreateDto dto)
    {
        var geom = _reader.Read<Geometry>(dto.GeometriJson);

        var kayit = new AlanAnaliz
        {
            KullaniciId = userId,
            GeometriAdi = dto.GeometriAdi,
            GeometriJson = dto.GeometriJson,
            AnalizTuru = "ORIJINAL",
            AlanMetrekare = geom.Area,
            OlusturmaTarihi = DateTime.Now
        };

        _context.AlanAnalizleri.Add(kayit);
        await _context.SaveChangesAsync();

        return kayit;
    }

    public async Task<Geometry?> GetGeometryAsync(int userId, string name)
    {
        var geo = await _context.AlanAnalizleri
            .FirstOrDefaultAsync(x => x.KullaniciId == userId && x.GeometriAdi == name);

        return geo == null ? null : _reader.Read<Geometry>(geo.GeometriJson);
    }

    public async Task<Geometry?> KesisimAsync(int userId, string a, string b)
    {
        var g1 = await GetGeometryAsync(userId, a);
        var g2 = await GetGeometryAsync(userId, b);

        if (g1 == null || g2 == null)
            return null;

        var intersection = g1.Intersection(g2);

        return intersection.IsEmpty ? null : intersection;
    }

    public async Task<AlanAnaliz> BirlesimABAsync(int userId)
    {
        var A = await GetGeometryAsync(userId, "A");
        var B = await GetGeometryAsync(userId, "B");

        if (A == null || B == null)
            throw new Exception("A veya B bulunamadı.");

        var union = A.Union(B);

        var kayit = new AlanAnaliz
        {
            KullaniciId = userId,
            GeometriAdi = "D",
            AnalizTuru = "UNION",
            GeometriJson = _writer.Write(union),
            AlanMetrekare = union.Area,
            OlusturmaTarihi = DateTime.Now
        };

        _context.AlanAnalizleri.Add(kayit);
        await _context.SaveChangesAsync();

        return kayit;
    }

    public async Task<AlanAnaliz> BirlesimABCAsync(int userId)
    {
        var A = await GetGeometryAsync(userId, "A");
        var B = await GetGeometryAsync(userId, "B");
        var C = await GetGeometryAsync(userId, "C");

        if (A == null || B == null || C == null)
            throw new Exception("A, B, C bulunamadı.");

        var union = A.Union(B).Union(C);

        var kayit = new AlanAnaliz
        {
            KullaniciId = userId,
            GeometriAdi = "E",
            AnalizTuru = "UNION",
            GeometriJson = _writer.Write(union),
            AlanMetrekare = union.Area,
            OlusturmaTarihi = DateTime.Now
        };

        _context.AlanAnalizleri.Add(kayit);
        await _context.SaveChangesAsync();

        return kayit;
    }
}
