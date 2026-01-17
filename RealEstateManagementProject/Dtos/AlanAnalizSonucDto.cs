namespace RealEstateManagementProject.Dtos
{
    public class AlanAnalizSonucDto
    {
        public string GeometriAdi { get; set; } = null!;  
        public string AnalizTuru { get; set; } = null!;      
        public string Islem { get; set; } = null!;          
        public string GeometriJson { get; set; } = null!;    
        public double AlanMetrekare { get; set; }           
        public DateTime OlusturmaTarihi { get; set; }
    }
}
