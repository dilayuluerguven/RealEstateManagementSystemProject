namespace RealEstateManagementProject.Entities.Concrete
{
    public class Tasinmaz
    {
        public int Id { get; set; }
        public int IlId { get; set; }
        public int IlceId { get; set; }
        public int MahalleId { get; set; }
        public int UserId { get; set; }
        public int Ada { get; set; }         
        public int Parsel { get; set; }       
        public string Adres { get; set; }
        public string EmlakTipi { get; set; }
        public string Koordinat { get; set; }  
    }
}
