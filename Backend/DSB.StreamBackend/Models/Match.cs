namespace DSB.StreamBackend.Models;

/// <summary>
/// Represents a match between two teams in the DSB streaming tool.
/// </summary>
public class Match
{
    /// <summary>
    /// Gets or sets the unique identifier for the match.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the match, which can be used for display purposes.
    /// </summary>
    public Guid? TeamAId { get; set; }

    /// <summary>
    /// Gets or sets the unique identifier for the second team in the match.
    /// </summary>
    public Guid? TeamBId { get; set; }

    /// <summary>
    /// Gets or sets the score for Team A in the match.
    /// </summary>
    public int? ScoreA { get; set; } = 0;

    /// <summary>
    /// Gets or sets the score for Team B in the match.
    /// </summary>
    public int? ScoreB { get; set; } = 0;

    /// <summary>
    /// Gets or sets the name of the current map being played in the match.
    /// </summary>
    public string? CurrentMap { get; set; }
}