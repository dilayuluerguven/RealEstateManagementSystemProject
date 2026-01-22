namespace RealEstateManagementProject.Dtos
{
    public class LogFilterDto
    {
        public int? Id { get; set; }        
        public string? AdSoyad { get; set; }
        public int? UserId { get; set; }
        public string? Durum { get; set; }
        public string? IslemTipi { get; set; }
        public string? Aciklama { get; set; }
        public DateTime? Tarih { get; set; }
        public string? IpAdresi { get; set; }
    }
}
