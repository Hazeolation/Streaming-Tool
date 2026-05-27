using Microsoft.EntityFrameworkCore;
using DSB.StreamBackend.Models;

namespace DSB.StreamBackend.Context;

/// <summary>
/// Represents the database context for the DSB streaming tool, providing access to the Teams, Players, Matches, and BroadcastState tables in the database.
/// </summary>
/// <param name="options">The options for configuring the database context.</param>
public class StreamToolDbContext(DbContextOptions<StreamToolDbContext> options) : DbContext(options)
{
    /// <summary>
    /// Gets the DbSet for the BroadcastState entity, allowing access to the broadcast state information in the database.
    /// </summary>
    public DbSet<Team> Teams => Set<Team>();

    /// <summary>
    /// Gets the DbSet for the Player entity, allowing access to the player information in the database.
    /// </summary>
    public DbSet<Player> Players => Set<Player>();

    /// <summary>
    /// Gets the DbSet for the Match entity, allowing access to the match information in the database.
    /// </summary>
    public DbSet<Match> Matches => Set<Match>();

    /// <summary>
    /// Gets the DbSet for the BroadcastState entity, allowing access to the broadcast state information in the database.
    /// </summary>
    public DbSet<BroadcastState> BroadcastState => Set<BroadcastState>();
}