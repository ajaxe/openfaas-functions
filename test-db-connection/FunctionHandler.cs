using Microsoft.Extensions.Configuration;
using MySql.Data.MySqlClient;
using System;
using System.Data;
using System.Text;

namespace Function
{
    public class FunctionHandler
    {
        public string Handle(string input) {
            var cfg = BootstrapConfiguration.Configuration;
            try
            {
                var count = CheckDbConnection();
                return $"Up - {count}";
            }
            catch(Exception e)
            {
                return $"Down - {e.Message}";
            }
        }

        public decimal CheckDbConnection()
        {
            var connBuilder = new MySqlConnectionStringBuilder(BootstrapConfiguration.Configuration.GetConnectionString("Database"));
            using(var connection = new MySqlConnection(connBuilder.ConnectionString))
            {
                try
                {
                    connection.Open();
                    var cmd = new MySqlCommand("select count(*) from Users", connection);
                    return Convert.ToDecimal(cmd.ExecuteScalar());
                }
                finally
                {
                    if(connection != null && connection.State == ConnectionState.Open)
                    {
                        connection.Close();
                    }
                }
            }
        }
    }
}
