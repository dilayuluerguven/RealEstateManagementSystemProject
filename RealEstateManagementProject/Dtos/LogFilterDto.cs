
namespace RealEstateManagementProject.Dtos
{
    public class LogFilterDTO
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? Durum { get; set; }
        public string IslemTipi { get; set; } = string.Empty;
        public string? Aciklama { get; set; }
        public DateTime? Tarih { get; set; }
        public string? IpAdresi { get; set; }
    }

}
