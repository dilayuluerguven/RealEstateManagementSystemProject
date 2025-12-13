using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class IlceDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "İlçe adı zorunludur.")]
        [MaxLength(100, ErrorMessage = "İlçe adı en fazla 100 karakter olabilir.")]
        public string IlceAdi { get; set; } = string.Empty;
        
        [Required]
        public int IlId { get; set; }
    }
}
