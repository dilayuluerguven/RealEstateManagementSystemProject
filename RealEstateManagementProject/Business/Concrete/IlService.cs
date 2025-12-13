using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
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
            return await _context.Iller
                .Select(il => new IlDto
                {
                    Id = il.Id,
                    IlAdi = il.IlAdi
                })
                .ToListAsync();
        }

        public async Task<IlDto?> GetByIdAsync(int id)
        {
            IlDto? ilDto = await _context.Iller
                .Select(il => new IlDto
                {
                    Id = il.Id,
                    IlAdi = il.IlAdi
                })
                .FirstOrDefaultAsync(il => il.Id == id);

            return ilDto;
        }

        public async Task<bool> AddAsync(IlDto ilDto)
        {
            var il = new Il
            {
                IlAdi = ilDto.IlAdi
            };

            await _context.Iller.AddAsync(il);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(int id, IlDto ilDto)
        {
            var il = await _context.Iller.FirstOrDefaultAsync(x => x.Id == id);

            if (il == null)
                return false;

            il.IlAdi = ilDto.IlAdi;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var il = await _context.Iller.FindAsync(id);

            if (il == null)
                return false;

            _context.Iller.Remove(il);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
