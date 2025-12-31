using System.ComponentModel.DataAnnotations;

public class UserUpdateDto
{
    [Required(ErrorMessage = "Ad soyad zorunludur.")]
    [MaxLength(100)]
    public string AdSoyad { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir email giriniz.")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Rol zorunludur.")]
    [MaxLength(50)]
    public string Rol { get; set; } = string.Empty;

    [MinLength(8, ErrorMessage = "Şifre en az 8 karakter olmalıdır.")]
    [MaxLength(12, ErrorMessage = "Şifre en fazla 12 karakter olabilir.")]
    [RegularExpression(
        @"^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,12}$",
        ErrorMessage = "Şifre 8-12 karakter olmalı ve en az 1 harf, 1 rakam, 1 özel karakter içermelidir."
    )]
    public string? Sifre { get; set; }
}
