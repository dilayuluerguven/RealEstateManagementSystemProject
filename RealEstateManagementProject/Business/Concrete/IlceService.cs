using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;


namespace RealEstateManagementProject.Business.Concrete
{
    public class IlceService : IIlceService
    {
        private readonly ApplicationDbContext _context;

        public IlceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<IlceDto>> GetByIlIdAsync(int ilId)
        {
            var ilceler = await _context.Ilceler
                .Where(i => i.IlId == ilId)
                .OrderBy(i => i.IlceAdi)
                .Select(i => new IlceDto
                {
                    Id = i.Id,
                    IlceAdi = i.IlceAdi,
                    IlId = i.IlId
                })
                .ToListAsync();
            return ilceler;
        }

    }
}
