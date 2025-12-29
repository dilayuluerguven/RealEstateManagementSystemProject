namespace RealEstateManagementProject.Dtos
{
    public class TasinmazListDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int IlId { get; set; }
        public int IlceId { get; set; }
        public int MahalleId { get; set; }

        public string IlAdi { get; set; } = string.Empty;
        public string IlceAdi { get; set; } = string.Empty;
        public string MahalleAdi { get; set; } = string.Empty;

        public int Ada { get; set; }
        public int Parsel { get; set; }

        public string Adres { get; set; } = string.Empty;
        public string EmlakTipi { get; set; } = string.Empty;

        public string Koordinat { get; set; } = string.Empty;
    }
}
