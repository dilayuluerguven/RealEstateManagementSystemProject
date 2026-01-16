using System;

namespace RealEstateManagementProject.Entities
{
    public class AlanAnaliz
    {
        public int Id { get; set; }
        public int KullaniciId { get; set; }
        public string GeometriAdi { get; set; }
        public string AnalizTuru { get; set; }
        public string GeometriJson { get; set; }
        public double AlanMetrekare { get; set; }
        public DateTime OlusturmaTarihi { get; set; } = DateTime.Now;
    }
}
