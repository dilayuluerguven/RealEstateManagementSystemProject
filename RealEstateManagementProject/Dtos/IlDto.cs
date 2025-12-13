using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class IlDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "İl adı zorunludur.")]
        [MaxLength(100, ErrorMessage = "İl adı en fazla 100 karakter olabilir.")]
        public string IlAdi { get; set; } = string.Empty;
    }
}
