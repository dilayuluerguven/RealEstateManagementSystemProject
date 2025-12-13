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
        private readonly ILogService _logService;

        public IlService(ApplicationDbContext context, ILogService logService)
        {
            _context = context;
            _logService = logService;
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
            try
            {
                var il = new Il
                {
                    IlAdi = ilDto.IlAdi
                };

                await _context.Iller.AddAsync(il);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "SUCCESS",
                    Aciklama = $"İl eklendi: {ilDto.IlAdi}",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "CREATE",
                    Durum = "ERROR",
                    Aciklama = $"İl eklenemedi: {ilDto.IlAdi}",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }


        public async Task<bool> UpdateAsync(int id, IlDto ilDto)
        {
            try
            {
                var il = await _context.Iller.FirstOrDefaultAsync(x => x.Id == id);
                if (il == null)
                    return false;

                il.IlAdi = ilDto.IlAdi;
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "SUCCESS",
                    Aciklama = $"İl güncellendi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "UPDATE",
                    Durum = "ERROR",
                    Aciklama = $"İl güncellenemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }

        public async Task<bool> DeleteAsync(int id)
        {
            try
            {
                var il = await _context.Iller.FindAsync(id);
                if (il == null)
                    return false;

                _context.Iller.Remove(il);
                await _context.SaveChangesAsync();

                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "SUCCESS",
                    Aciklama = $"İl silindi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return true;
            }
            catch
            {
                await _logService.AddAsync(new Log
                {
                    IslemTipi = "DELETE",
                    Durum = "ERROR",
                    Aciklama = $"İl silinemedi (Id={id})",
                    Tarih = DateTime.UtcNow
                });

                return false;
            }
        }

    }
}
