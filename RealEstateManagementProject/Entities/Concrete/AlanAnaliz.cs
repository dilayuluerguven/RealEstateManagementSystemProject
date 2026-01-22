using System;

namespace RealEstateManagementProject.Entities
{
    public class AlanAnaliz
    {
        public int Id { get; set; }
        public int KullaniciId { get; set; }
        public string GeometriAdi { get; set; } = string.Empty;
        public string AnalizTuru { get; set; } = string.Empty;
        public string GeometriJson { get; set; } = string.Empty;
        public double AlanMetrekare { get; set; }
        public DateTime OlusturmaTarihi { get; set; } = DateTime.UtcNow;
    }

}
