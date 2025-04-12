var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

services.AddSpaStaticFiles(configuration: options => { options.RootPath = "clientapp\\src"; });
services.AddControllers();

services.AddCors(options =>
{
    options.AddPolicy("VueCorsPolicy", policyBuilder =>
    {
        policyBuilder
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .WithOrigins("http://localhost:8080");
    });
});

var app = builder.Build();

app.UseRouting();
app.UseCors("VueCorsPolicy");

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.Run();
