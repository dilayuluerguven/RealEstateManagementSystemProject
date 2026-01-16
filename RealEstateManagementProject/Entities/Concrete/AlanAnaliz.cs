using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using RealEstateManagementProject.Entities.Concrete;

namespace RealEstateManagementProject.Entities
{
    public class AlanAnaliz
    {
        [Key]
        public int Id { get; set; }

        public int KullaniciId { get; set; }

        [ForeignKey(nameof(KullaniciId))]
        public User Kullanici { get; set; }

        [Required]
        public string GeometriAdi { get; set; }

        [Required]
        public string GeometriTuru { get; set; } 

        public string? IslemTuru { get; set; }

        [Required]
        public string GeometriJson { get; set; }

        public double AlanMetrekare { get; set; }

        public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
    }
}
