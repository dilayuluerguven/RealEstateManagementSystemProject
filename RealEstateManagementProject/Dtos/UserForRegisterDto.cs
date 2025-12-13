using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class UserForRegisterDto
    {
        [Required(ErrorMessage = "Ad soyad zorunludur.")]
        [MaxLength(100, ErrorMessage = "Ad soyad en fazla 100 karakter olabilir.")]
        public string AdSoyad { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email zorunludur.")]
        [EmailAddress(ErrorMessage = "Geçerli bir email giriniz.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Şifre zorunludur.")]
        [MinLength(6, ErrorMessage = "Şifre en az 6 karakter olmalıdır.")]
        public string Sifre { get; set; } = string.Empty;

        [Required(ErrorMessage = "Rol zorunludur.")]
        [MaxLength(50, ErrorMessage = "Rol en fazla 50 karakter olabilir.")]
        public string Rol { get; set; } = string.Empty;
    }
}
