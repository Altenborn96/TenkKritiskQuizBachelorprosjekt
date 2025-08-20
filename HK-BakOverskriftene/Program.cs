using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BakOverskriftene.Domain.Models;

internal class Program
{
    private static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Configure CORS - Temporary allow all setup
        builder.Services.AddCors(options => {
            options.AddPolicy("AllowAny",
                policy => policy
                    .AllowAnyOrigin()
                    .AllowAnyHeader()
                    .AllowAnyMethod());
        });

        // Add services to the container.
        builder.Services.AddAuthorization();

        // Add email service 
        builder.Services.AddHttpClient<MailerSendService>();

        // Add Identity services and register the DbContext
        builder.Services.AddIdentity<Player, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        builder.Services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequiredLength = 4;
            options.Password.RequireDigit = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireLowercase = false;
        });

        // Load the connection string from environment variables if available
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__DefaultConnection");

        if (string.IsNullOrEmpty(connectionString))
        {
            connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
        }

        // Register ApplicationDbContext and configure SQL Server connection
        builder.Services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(connectionString,
                b => b.MigrationsAssembly("BakOverskriftene.DataAccess")));

        builder.Services.AddControllers()
            .AddJsonOptions(options => {
                options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
            });

        builder.Services.AddScoped<JwtTokenService>();

        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;

            var jwtSecret = builder.Configuration["JwtSettings:Secret"];
            var key = Encoding.UTF8.GetBytes(jwtSecret);

            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false, // Sett til true hvis du har en spesifikk issuer
                ValidateAudience = false, // Sett til true hvis du har en spesifikk audience
                ValidateLifetime = true
            };

            options.Events = new JwtBearerEvents
            {
                OnAuthenticationFailed = context =>
                {
                    Console.WriteLine("Auth mislykket: ");
                    Console.WriteLine(context.Exception);
                    return Task.CompletedTask;
                },
                OnChallenge = context =>
                {
                    context.HandleResponse();
                    context.Response.StatusCode = 401;
                    context.Response.ContentType = "application/json";

                    var result = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        error = "Ikke autentisert",
                        reason = context.ErrorDescription ?? "Ugyldig eller manglende token"
                    });

                    return context.Response.WriteAsync(result);
                }
            };
        });

        // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        // CORS middleware - this should be before authentication and authorization
        app.UseCors("AllowAny"); // Allow cross-origin requests

        // Static files middleware (needed to serve React app)
        app.UseStaticFiles();

        // HTTPS redirection - generally placed before authorization for secure connections
        app.UseHttpsRedirection();

        // Authentication middleware - should be before authorization
        app.UseAuthentication(); // This will authenticate the user

        // Authorization middleware - follows authentication, checking if the user has the right permissions
        app.UseAuthorization();

        // Swagger - only in development environment
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        // Map controllers (routes for your API endpoints)
        app.MapControllers();

        // Fallback route for React (single-page app)
        app.MapFallbackToFile("index.html");

        app.Run();
    }
}
