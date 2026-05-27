namespace DSB.StreamBackend.DTOs;

/// <summary>
/// Data Transfer Object for updating match scores.
/// </summary>
public class UpdateScoreDto
{
    /// <summary>
    /// The score for team A.
    /// </summary>
    public int ScoreA { get; set; }

    /// <summary>
    /// The score for team B.
    /// </summary>
    public int ScoreB { get; set; }
}