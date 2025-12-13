using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Ad soyad zorunludur.")]
        [MaxLength(100)]
        public string AdSoyad { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir email giriniz.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rol zorunludur.")]
        [MaxLength(50)]
        public string Rol { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;

    }
}
