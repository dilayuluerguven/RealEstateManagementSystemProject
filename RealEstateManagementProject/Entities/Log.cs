using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Entities
{
    public class Log
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Durum { get; set; }         
        public string IslemTipi { get; set; }      
        public string Aciklama { get; set; }       
        public DateTime Tarih { get; set; }       
        public string IpAdresi { get; set; }       
    }
}
