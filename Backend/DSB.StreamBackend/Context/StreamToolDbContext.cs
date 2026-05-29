using Microsoft.EntityFrameworkCore;
using DSB.StreamBackend.Models;

namespace DSB.StreamBackend.Context;

public class StreamToolDbContext(
    DbContextOptions<StreamToolDbContext> options) : DbContext(options)
{
    public DbSet<BroadcastStateEntity> BroadcastStates => Set<BroadcastStateEntity>();

    public DbSet<MapStateEntity> MapStates => Set<MapStateEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<BroadcastStateEntity>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<MapStateEntity>()
            .HasKey(x => x.Id);

        modelBuilder.Entity<BroadcastStateEntity>()
            .HasMany(x => x.Maps)
            .WithOne(x => x.BroadcastState)
            .HasForeignKey(x => x.BroadcastStateEntityId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<BroadcastStateEntity>()
            .HasData(new BroadcastStateEntity
            {
                Id = 1,
                TeamAlphaName = "Team Alpha",
                TeamBravoName = "Team Bravo",
                AlphaIsLeft = true,
                ScoreAlpha = 0,
                ScoreBravo = 0,
                ShowMapScreen = true,
                ShowScoreBox = true,
                ShowCommentatorBox = true,
                ShowInfobox = true,
                Division = 1,
                Season = 10
            });
    }
}