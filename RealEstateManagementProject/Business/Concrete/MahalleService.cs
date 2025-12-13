using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
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

        public async Task<List<MahalleDto>> GetAllAsync()
        {
            return await _context.Mahalleler
                .Select(x => new MahalleDto
                {
                    Id = x.Id,
                    MahalleAdi = x.MahalleAdi,
                    IlceId = x.IlceId
                })
                .ToListAsync();
        }

        public async Task<MahalleDto?> GetByIdAsync(int id)
        {
            var mahalle = await _context.Mahalleler.FindAsync(id);

            if (mahalle == null)
                return null;

            return new MahalleDto
            {
                Id = mahalle.Id,
                MahalleAdi = mahalle.MahalleAdi,
                IlceId = mahalle.IlceId
            };
        }
        public async Task<bool> AddAsync(MahalleDto dto)
        {
            var mahalle = new Mahalle
            {
                MahalleAdi = dto.MahalleAdi,
                IlceId = dto.IlceId
            };

            await _context.Mahalleler.AddAsync(mahalle);
            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> UpdateAsync(int id, MahalleDto dto)
        {
            var mahalle = await _context.Mahalleler.FirstOrDefaultAsync(x => x.Id == id);

            if (mahalle == null)
                return false;

            mahalle.MahalleAdi = dto.MahalleAdi;
            mahalle.IlceId = dto.IlceId;

            await _context.SaveChangesAsync();
            return true;
        }
        public async Task<bool> DeleteAsync(int id)
        {
            var mahalle = await _context.Mahalleler.FindAsync(id);
            if(mahalle == null) 
                return false;
            _context.Mahalleler.Remove(mahalle);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
