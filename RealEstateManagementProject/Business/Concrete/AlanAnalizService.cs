using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.DataAccess;

namespace RealEstateManagementProject.Business.Concrete
{
    public class AlanAnalizService : IAlanAnalizService
    {
        private readonly ApplicationDbContext _context;

        public AlanAnalizService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> GeometriKaydetAsync(int kullaniciId, AlanAnalizCreateDto dto)
        {
            var kayit = new AlanAnaliz
            {
                KullaniciId = kullaniciId,
                GeometriAdi = dto.GeometriAdi,
                GeometriTuru = "Orijinal",
                GeometriJson = dto.GeometriJson,
                AlanMetrekare = dto.AlanMetrekare,
                OlusturmaTarihi = DateTime.Now
            };

            _context.AlanAnalizleri.Add(kayit);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<AlanAnalizSonucDto>> KayitliGeometrileriGetirAsync(int kullaniciId)
        {
            return await _context.AlanAnalizleri
                .Where(x => x.KullaniciId == kullaniciId && x.GeometriTuru == "Orijinal")
                .Select(x => new AlanAnalizSonucDto
                {
                    GeometriAdi = x.GeometriAdi,
                    GeometriJson = x.GeometriJson,
                    AlanMetrekare = x.AlanMetrekare
                })
                .ToListAsync();
        }

        public async Task<AlanAnalizSonucDto?> KesisimHesaplaAsync(int kullaniciId, AlanAnalizIslemDto dto)
        {
            var parca = dto.IslemTuru.Split("_");

            string g1 = parca[0]; 
            string g2 = parca[2]; 

            var geo1 = await GetGeometriAsync(kullaniciId, g1);
            var geo2 = await GetGeometriAsync(kullaniciId, g2);

            if (geo1 == null || geo2 == null)
                return null;


            string yeniGeoJson = "{}"; 
            double alan = 0;

            return new AlanAnalizSonucDto
            {
                GeometriAdi = $"{g1}_{g2}_KESISIM",
                GeometriJson = yeniGeoJson,
                AlanMetrekare = alan
            };
        }

        public async Task<AlanAnalizSonucDto?> BirlesimHesaplaAsync(int kullaniciId, AlanAnalizIslemDto dto)
        {
            var parca = dto.IslemTuru.Split("_");

            string ilk = parca[0]; 
            string ikinci = parca[2]; 
            string ucuncu = parca.Length > 3 ? "C" : null;

            var geo1 = await GetGeometriAsync(kullaniciId, ilk);
            var geo2 = await GetGeometriAsync(kullaniciId, ikinci);

            if (geo1 == null || geo2 == null)
                return null;

            string yeniGeometriAdi = ucuncu == null ? "D" : "E";

            string yeniGeoJson = "{}";
            double alan = 0;

            var kayit = new AlanAnaliz
            {
                KullaniciId = kullaniciId,
                GeometriAdi = yeniGeometriAdi,
                GeometriTuru = "Birlesim",
                IslemTuru = dto.IslemTuru,
                GeometriJson = yeniGeoJson,
                AlanMetrekare = alan,
                OlusturmaTarihi = DateTime.Now
            };

            _context.AlanAnalizleri.Add(kayit);
            await _context.SaveChangesAsync();

            return new AlanAnalizSonucDto
            {
                GeometriAdi = yeniGeometriAdi,
                GeometriJson = yeniGeoJson,
                AlanMetrekare = alan
            };
        }

        public async Task<List<AlanAnalizSonucDto>> TumAnalizleriGetirAsync(int kullaniciId)
        {
            return await _context.AlanAnalizleri
                .Where(x => x.KullaniciId == kullaniciId)
                .Select(x => new AlanAnalizSonucDto
                {
                    GeometriAdi = x.GeometriAdi,
                    GeometriJson = x.GeometriJson,
                    AlanMetrekare = x.AlanMetrekare
                })
                .ToListAsync();
        }

        private async Task<AlanAnaliz?> GetGeometriAsync(int kullaniciId, string geometriAdi)
        {
            return await _context.AlanAnalizleri
                .FirstOrDefaultAsync(x =>
                    x.KullaniciId == kullaniciId &&
                    x.GeometriAdi == geometriAdi &&
                    x.GeometriTuru == "Orijinal");
        }
    }
}
