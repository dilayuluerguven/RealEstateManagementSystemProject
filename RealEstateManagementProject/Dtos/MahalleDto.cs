using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class MahalleDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage="Mahalle adı zorunludur.")]
        [MaxLength(100, ErrorMessage = "Mahalle adı en fazla 100 karakter olabilir.")]

        public string MahalleAdi { get; set; }=string.Empty;
        public int IlceId { get; set; }
    }
}
