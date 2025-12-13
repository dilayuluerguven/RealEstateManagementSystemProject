using System.Security.Cryptography;
using System.Text;

namespace RealEstateManagementProject.Helpers
{
    public static class HashHelper
    {
        public static string Sha256Hash(string metin)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(metin);
            var hash = sha.ComputeHash(bytes);
            return BitConverter.ToString(hash)
                .Replace("-", "")
                .ToLower();
        }
    }
}
