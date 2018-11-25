using System;
using System.Text;
using System.Linq;
using System.Collections.Generic;
using System.Collections;
using Newtonsoft.Json;

namespace Function
{
    public class FunctionHandler
    {
        private Dictionary<string, string> headers;

        public FunctionHandler()
        {
            headers = new Dictionary<string, string>();
        }
        private void BuildHeaderDictionary()
        {
            if(!headers.Keys.Any())
            {
                foreach (DictionaryEntry de in Environment.GetEnvironmentVariables())
                {
                    if(de.Key.ToString().StartsWith("Http_"))
                    {
                        headers.Add(de.Key.ToString(), de.Value?.ToString());
                    }
                }
            }
        }
        private string GetHttpMethod()
        {
            BuildHeaderDictionary();
            return headers["Http_Method"];
        }
        public string Handle(string input)
        {
            var requestMethod = GetHttpMethod();
            headers.Add("Response_Text", $"[{requestMethod}]Hi there - your input was: {input}");
            return JsonConvert.SerializeObject(headers);
        }
    }
}
