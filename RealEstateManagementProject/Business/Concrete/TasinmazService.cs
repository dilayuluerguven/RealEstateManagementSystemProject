using Microsoft.EntityFrameworkCore;
using RealEstateManagementProject.Business.Abstract;
using RealEstateManagementProject.DataAccess;
using RealEstateManagementProject.Dtos;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Business.Concrete
{
    public class TasinmazService : ITasinmazService
    {
        private readonly ApplicationDbContext _context;

        public TasinmazService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<TasinmazDto>> GetAllAsync()
        {
            return await _context.Tasinmazlar
                .Select(x => new TasinmazDto
                {
                    Id = x.Id,
                    IlId = x.IlId,
                    IlceId = x.IlceId,
                    MahalleId = x.MahalleId,
                    UserId = x.UserId,
                    Ada = x.Ada,
                    Parsel = x.Parsel,
                    Adres = x.Adres,
                    EmlakTipi = x.EmlakTipi,
                    Koordinat = x.Koordinat
                })
                .ToListAsync();
        }

        public async Task<TasinmazDto?> GetByIdAsync(int id)
        {
            var tasinmaz = await _context.Tasinmazlar.FindAsync(id);

            if (tasinmaz == null)
                return null;

            return new TasinmazDto
            {
                Id = tasinmaz.Id,
                IlId = tasinmaz.IlId,
                IlceId = tasinmaz.IlceId,
                MahalleId = tasinmaz.MahalleId,
                UserId = tasinmaz.UserId,
                Ada = tasinmaz.Ada,
                Parsel = tasinmaz.Parsel,
                Adres = tasinmaz.Adres,
                EmlakTipi = tasinmaz.EmlakTipi,
                Koordinat = tasinmaz.Koordinat
            };
        }

        public async Task<bool> AddAsync(TasinmazDto dto)
        {
            var tasinmaz = new Tasinmaz
            {
                IlId = dto.IlId,
                IlceId = dto.IlceId,
                MahalleId = dto.MahalleId,
                UserId = dto.UserId,
                Ada = dto.Ada,
                Parsel = dto.Parsel,
                Adres = dto.Adres,
                EmlakTipi = dto.EmlakTipi,
                Koordinat = dto.Koordinat
            };

            await _context.Tasinmazlar.AddAsync(tasinmaz);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateAsync(int id, TasinmazDto dto)
        {
            var tasinmaz = await _context.Tasinmazlar.FirstOrDefaultAsync(x => x.Id == id);

            if (tasinmaz == null)
                return false;

            tasinmaz.IlId = dto.IlId;
            tasinmaz.IlceId = dto.IlceId;
            tasinmaz.MahalleId = dto.MahalleId;
            tasinmaz.UserId = dto.UserId;
            tasinmaz.Ada = dto.Ada;
            tasinmaz.Parsel = dto.Parsel;
            tasinmaz.Adres = dto.Adres;
            tasinmaz.EmlakTipi = dto.EmlakTipi;
            tasinmaz.Koordinat = dto.Koordinat;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var tasinmaz = await _context.Tasinmazlar.FindAsync(id);

            if (tasinmaz == null)
                return false;

            _context.Tasinmazlar.Remove(tasinmaz);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
