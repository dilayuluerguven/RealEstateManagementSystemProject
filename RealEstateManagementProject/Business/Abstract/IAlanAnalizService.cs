using RealEstateManagementProject.Dtos;

public interface IAlanAnalizService
{
    Task<AlanAnalizSonucDto> KaydetAsync(int kullaniciId, AlanAnalizCreateDto dto);

    Task<AlanAnalizSonucDto?> GetirAsync(int kullaniciId, string geometriAdi);

    Task<List<AlanAnalizSonucDto>> ListeAsync(int kullaniciId);

    Task<bool> SilAsync(int kullaniciId, int id);

    Task<bool> GeometriyeGoreSilAsync(int kullaniciId, string geometriAdi);
}