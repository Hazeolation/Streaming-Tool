using Microsoft.EntityFrameworkCore;
using DSB.StreamBackend.Models;

namespace DSB.StreamBackend.Context;

/// <summary>
/// DbContext for the StreamTool application, managing the database interactions for broadcast and map states.
/// </summary>
/// <param name="options">The options for configuring the DbContext.</param>
public class StreamToolDbContext(
    DbContextOptions<StreamToolDbContext> options) : DbContext(options)
{
    /// <summary>
    /// DbSet representing the collection of BroadcastStateEntity records in the database.
    /// </summary>
    public DbSet<BroadcastStateEntity> BroadcastStates => Set<BroadcastStateEntity>();

    /// <summary>
    /// DbSet representing the collection of MapStateEntity records in the database.
    /// </summary>
    public DbSet<MapStateEntity> MapStates => Set<MapStateEntity>();

    /// <summary>
    /// DbSet representing the collection of Socials records in the database.
    /// </summary>
    public DbSet<SocialsEntity> Socials => Set<SocialsEntity>();

    /// <summary>
    /// DbSet representing the collection of CommentatorBoxTimeData records in the database.
    /// </summary>
    public DbSet<CommentatorBoxTimeDataEntity> CommentatorBoxTimeData => Set<CommentatorBoxTimeDataEntity>();

    /// <summary>
    /// Configures the model by defining the relationships and seeding initial data for the BroadcastStateEntity and MapStateEntity tables.
    /// </summary>
    /// <param name="modelBuilder">The ModelBuilder instance used to configure the model.</param>
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