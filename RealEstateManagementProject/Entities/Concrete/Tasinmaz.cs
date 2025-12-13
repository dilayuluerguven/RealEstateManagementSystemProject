namespace RealEstateManagementProject.Entities.Concrete
{
    public class Tasinmaz
    {
        public int Id { get; set; }
        public int IlId { get; set; }
        public Il Il { get; set; } = null!;
        public int IlceId { get; set; }
        public Ilce Ilce { get; set; } = null!;
        public int MahalleId { get; set; }
        public Mahalle Mahalle { get; set; } = null!;
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int Ada { get; set; }
        public int Parsel { get; set; }
        public string Adres { get; set; } = string.Empty;
        public string EmlakTipi { get; set; } = string.Empty;
        public string Koordinat { get; set; } = string.Empty;
    }
}
