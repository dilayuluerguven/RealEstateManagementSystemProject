using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class IlceService : IIlceService
    {
        private readonly ApplicationDbContext _context;

        public IlceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<IlceDto>> GetAllAsync()
        {
            return await _context.Ilceler
                .Select(x => new IlceDto
                {
                    Id = x.Id,
                    IlceAdi = x.IlceAdi,
                    IlId = x.IlId
                }).ToListAsync();
        }

        public async Task<IlceDto?> GetByIdAsync(int id)
        {
            var ilce = await _context.Ilceler.FindAsync(id);

            if (ilce == null)
                return null;

            var result = new IlceDto
            {
                Id=ilce.Id,
                IlceAdi=ilce.IlceAdi,
                IlId=ilce.IlId
            };
            return result;
        }
        public async Task<bool> AddAsync(IlceDto dto)
        {
            var ilce = new Ilce
            {
                IlceAdi = dto.IlceAdi,
                IlId = dto.IlId
            };

            await _context.Ilceler.AddAsync(ilce);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateAsync(int id, IlceDto dto)
        {
            var ilce = await _context.Ilceler.FirstOrDefaultAsync(x => x.Id == id);

            if (ilce == null)
                return false;

            ilce.IlceAdi = dto.IlceAdi;
            ilce.IlId = dto.IlId;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var ilce = await _context.Ilceler.FindAsync(id);

            if (ilce == null)
                return false;

            _context.Ilceler.Remove(ilce);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
