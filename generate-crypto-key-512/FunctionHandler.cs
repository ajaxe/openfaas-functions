using System;
using System.Text;
using System.Security.Cryptography;

namespace Function
{
    public class FunctionHandler
    {
        private const int KeySize = 512;
        public string Handle(string input) {
            using(var svc = RNGCryptoServiceProvider.Create())
            {
                var buffer = new byte[KeySize / 8];
                svc.GetBytes(buffer);
                return Convert.ToBase64String(buffer);
            }
        }
    }
}
