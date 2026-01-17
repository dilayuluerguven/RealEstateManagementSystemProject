using NetTopologySuite.Geometries;
using RealEstateManagementProject.Dtos;

public interface IAlanAnalizService
{
    Task<AlanAnalizSonucDto> KaydetAsync(int userId, AlanAnalizCreateDto dto);

    Task<Geometry?> GetGeometryAsync(int userId, string geometriAdi);

    Task<Geometry?> KesisimAsync(int userId, string a, string b);

    Task<AlanAnalizSonucDto> BirlesimABAsync(int userId);

    Task<AlanAnalizSonucDto> BirlesimABCAsync(int userId);
}
