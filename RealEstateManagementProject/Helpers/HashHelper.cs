using System.Security.Cryptography;
using System.Text;

namespace RealEstateManagementProject.Helpers
{
    public static class HashHelper
    {
        public static string Sha256Hash(string metin)
        {
            var bytes = Encoding.UTF8.GetBytes(metin);

            byte[] hash = SHA256.HashData(bytes);

            return BitConverter
                .ToString(hash)
                .Replace("-", "")
                .ToLower();
        }
    }
}
