using Microsoft.EntityFrameworkCore;
using DSB.StreamBackend.Context;
using DSB.StreamBackend.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddSignalR();

builder.Services.AddDbContext<StreamToolDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
                .WithOrigins("http://localhost:4200");
        }
    );
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<StreamToolDbContext>();
    dbContext.Database.Migrate();
}

app.UseCors("AllowAngular");

app.MapHub<OverlayHub>("/overlayHub");

app.Run();