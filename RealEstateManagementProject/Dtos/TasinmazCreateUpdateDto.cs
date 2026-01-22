using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class TasinmazCreateUpdateDto
    {
        public int Id { get; set; }

        [Required]
        public int IlId { get; set; }

        [Required]
        public int IlceId { get; set; }

        [Required]
        public int MahalleId { get; set; }

        [BindNever]
        public int UserId { get; set; }

        [Required]
        public int Ada { get; set; }

        [Required]
        public int Parsel { get; set; }

        [Required]
        [MaxLength(500)]
        public string Adres { get; set; } = null!;

        [Required]
        [MaxLength(50)]
        public string EmlakTipi { get; set; } = null!;

        [Required]
        public string Koordinat { get; set; } = null!;

        public IFormFile? Image { get; set; }
    }
}
