namespace RealEstateManagementProject.Entities.Concrete
{
    public class Mahalle
    {
        public int Id { get; set; }
        public string MahalleAdi { get; set; } = string.Empty;
        public int IlceId { get; set; }
        public Ilce Ilce { get; set; } = null!;
    }
}
