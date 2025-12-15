using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class IlService : IIlService
    {
        private readonly ApplicationDbContext _context;

        public IlService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<IlDto>> GetAllAsync()
        {
            return await _context.Iller.Select(il => new IlDto
             {
                    Id = il.Id,
                    IlAdi = il.IlAdi
             }).ToListAsync();
        } 
    }
}
