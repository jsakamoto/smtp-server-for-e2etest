using System;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Toolbelt.Net.Smtp
{
    /// <summary>
    /// Holo
    /// </summary>
    [Route("api/config")]
    public class AppConfigController : Controller
    {
        public AppConfigService AppConfigService { get; set; }

        public AppConfigController(AppConfigService appConfigService)
        {
            this.AppConfigService = appConfigService;
        }

        /// <summary>
        /// Get the application configuration.
        /// </summary>
        [HttpGet]
        public AppConfig Get()
        {
            return this.AppConfigService.AppConfig;
        }

        /// <summary>
        /// Set the application configuration. (you can send JSON with only needed properties to you want to change.)
        /// </summary>
        [HttpPost, HttpPut, HttpPatch]
        public async Task<IActionResult> Put()
        {
            if (!this.Request.ContentLength.HasValue) return BadRequest();

            try
            {
                var body = new byte[this.Request.ContentLength.Value];
                await this.Request.Body.ReadAsync(body, 0, body.Length);
                var content = Encoding.UTF8.GetString(body);

                this.AppConfigService.Update(content);
            }
            catch (ObjectDisposedException) { }

            return Ok();
        }
    }
}
