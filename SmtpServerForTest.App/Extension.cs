using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Newtonsoft.Json;

namespace Toolbelt.Net.Smtp
{
    public static class Extension
    {
        public static string ToJson(this object obj)
        {
            return JsonConvert.SerializeObject(obj);
        }

        public static T FromJsonTo<T>(this string value)
        {
            return JsonConvert.DeserializeObject<T>(value);
        }
    }
}
