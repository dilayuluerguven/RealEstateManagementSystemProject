using NetTopologySuite.Geometries;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;

public interface IAlanAnalizService
{
    Task<AlanAnaliz> KaydetAsync(int userId, AlanAnalizCreateDto dto);

    Task<Geometry?> GetGeometryAsync(int userId, string geometriAdi);

    Task<Geometry?> KesisimAsync(int userId, string a, string b);

    Task<AlanAnaliz> BirlesimABAsync(int userId);

    Task<AlanAnaliz> BirlesimABCAsync(int userId);
}
