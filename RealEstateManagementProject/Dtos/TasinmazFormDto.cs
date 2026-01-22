namespace RealEstateManagementProject.Dtos
{
    public class TasinmazFormDto
    {
        public string? IlId { get; set; }
        public string? IlceId { get; set; }
        public string? MahalleId { get; set; }
        public string? Ada { get; set; }
        public string? Parsel { get; set; }

        public string? Adres { get; set; }
        public string? EmlakTipi { get; set; }
        public string? Koordinat { get; set; }

        public IFormFile? Image { get; set; }
    }
}
