using Microsoft.EntityFrameworkCore;
using DSB.StreamBackend.Context;
using DSB.StreamBackend.Hubs;
using DSB.StreamBackend.Services;
using DSB.StreamBackend.Logging;

// Program.cs configures the web host, dependency injection, middleware,
// SignalR, database migration, CORS, and endpoint routing for the backend.
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddSignalR();

builder.Services.AddDbContext<StreamToolDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddSingleton<ILogService, LogService>();
builder.Services.AddSingleton<ILogSink, ConsoleLogSink>();
builder.Services.AddScoped<BroadcastStateService>();
builder.Services.AddScoped<SocialsService>();
builder.Services.AddScoped<CommentatorBoxTimeDataService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:4200",
                    "http://localhost:4201")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<StreamToolDbContext>();

    db.Database.Migrate();
}

app.MapControllers();

app.MapHub<OverlayHub>("/overlayHub");
app.MapHub<EventHub>("/eventHub");

app.Run();