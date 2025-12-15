using System.ComponentModel.DataAnnotations;

namespace RealEstateManagementProject.Dtos
{
    public class MahalleDto
    {
        public int Id { get; set; }
        public string MahalleAdi { get; set; }=string.Empty;
        public int IlceId { get; set; }
    }
}
