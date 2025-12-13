using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class TasinmazDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "İl bilgisi zorunludur.")]
        public int IlId { get; set; }

        [Required(ErrorMessage = "İlçe bilgisi zorunludur.")]
        public int IlceId { get; set; }

        [Required(ErrorMessage = "Mahalle bilgisi zorunludur.")]
        public int MahalleId { get; set; }

        [Required(ErrorMessage = "Kullanıcı bilgisi zorunludur.")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Ada bilgisi zorunludur.")]
        public int Ada { get; set; }

        [Required(ErrorMessage = "Parsel bilgisi zorunludur.")]
        public int Parsel { get; set; }

        [Required(ErrorMessage = "Adres zorunludur.")]
        [MaxLength(500, ErrorMessage = "Adres en fazla 500 karakter olabilir.")]
        public string Adres { get; set; } = string.Empty;

        [Required(ErrorMessage = "Emlak tipi zorunludur.")]
        [MaxLength(50, ErrorMessage = "Emlak tipi en fazla 50 karakter olabilir.")]
        public string EmlakTipi { get; set; } = string.Empty;

        [Required(ErrorMessage = "Koordinat bilgisi zorunludur.")]
        [MaxLength(100, ErrorMessage = "Koordinat en fazla 100 karakter olabilir.")]
        public string Koordinat { get; set; } = string.Empty;
    }
}
