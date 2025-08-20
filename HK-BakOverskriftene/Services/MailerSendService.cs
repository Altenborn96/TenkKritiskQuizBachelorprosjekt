using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class MailerSendService
{
    private readonly HttpClient _httpClient;
    private readonly string _token;

    public MailerSendService(HttpClient httpClient, IConfiguration config)
    {
        _httpClient = httpClient;
        _token = config["MailerSend:ApiKey"];

        _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _token);
    }

    public async Task SendEmail(string toEmail, string resetLink)
    {
        var subject = "Tilbakestill passordet ditt";

        // HTML-innholdet med knappen
        var htmlContent = $@"
            <h1 style='margin-top:0;color:#111;font-size:24px;'>Hei!</h1>
            <p style='color:#4a5566;font-size:16px;line-height:28px;'>
                Du ba nylig om å tilbakestille passordet ditt.<br>
                <strong>Lenken er gyldig i 24 timer.</strong>
            </p>
            <p style='margin: 24px 0;'>
                <a href='{resetLink}' style='background:#0052e2;color:#fff;padding:12px 24px;
                text-decoration:none;border-radius:4px;font-weight:600;'>Tilbakestill passord</a>
            </p>
            <p style='font-size:14px;color:#4a5566;'>Hvis knappen ikke fungerer, kan du bruke denne lenken:<br>{resetLink}</p>
            <p style='color:#4a5566;font-size:16px;'>Hilsen,<br>Tenk Kritisk-teamet</p>
        ";

        // Fallback tekst hvis e-postklient ikke støtter HTML
        var textContent = $"Du ba nylig om å tilbakestille passordet ditt.\n\n" +
                          $"Klikk på denne lenken (gyldig i 24 timer):\n{resetLink}\n\n" +
                          $"Hilsen,\nTenk Kritisk-teamet";

        var body = new
        {
            from = new { email = "noreply@tenk-kritisk.no", name = "Tenk Kritisk" },
            to = new[] { new { email = toEmail } },
            subject = subject,
            text = textContent,
            html = htmlContent
        };

        var json = JsonSerializer.Serialize(body);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var res = await _httpClient.PostAsync("https://api.mailersend.com/v1/email", content);

        if (!res.IsSuccessStatusCode)
        {
            var error = await res.Content.ReadAsStringAsync();
            Console.WriteLine($"MailerSend feilmelding: {error}");
            throw new HttpRequestException($"Feil ved sending: {res.StatusCode}, {error}");
        }
    }
}
