using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class MahalleService : IMahalleService
    {
        private readonly ApplicationDbContext _context;

        public MahalleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<MahalleDto>> GetByIlceIdAsync(int ilceId)
        {
            return await _context.Mahalleler
                .Where(m => m.IlceId == ilceId)
                .OrderBy(m => m.MahalleAdi)
                .Select(m => new MahalleDto
                {
                    Id = m.Id,
                    MahalleAdi= m.MahalleAdi,
                    IlceId = m.IlceId
                })
                .ToListAsync();
        }
    }
}
