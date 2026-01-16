using RealEstateManagementProject.Dtos;

namespace RealEstateManagementProject.Business.Abstract
{
    public interface IAlanAnalizService
    {
        Task<bool> GeometriKaydetAsync(int kullaniciId, AlanAnalizCreateDto dto);

        Task<List<AlanAnalizSonucDto>> KayitliGeometrileriGetirAsync(int kullaniciId);

        Task<AlanAnalizSonucDto?> KesisimHesaplaAsync(int kullaniciId, AlanAnalizIslemDto dto);

        Task<AlanAnalizSonucDto?> BirlesimHesaplaAsync(int kullaniciId, AlanAnalizIslemDto dto);

        Task<List<AlanAnalizSonucDto>> TumAnalizleriGetirAsync(int kullaniciId);
    }
}
