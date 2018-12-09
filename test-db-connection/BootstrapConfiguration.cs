using System;
using System.Text;
using Microsoft.Extensions.Configuration;

namespace Function
{
    public static class BootstrapConfiguration
    {
        public static IConfiguration Configuration => ConfigInitializer.Value;
        private static Lazy<IConfiguration> ConfigInitializer = new Lazy<IConfiguration>(() => {
            var sb = new StringBuilder();
            sb.AppendLine($"Build configuration - Start");
            var builder = new ConfigurationBuilder();
            builder.AddJsonFile("./secrets/dbConnection.json");
            sb.AppendLine($"Build configuration - End");
            return builder.Build();
        });

    }
}