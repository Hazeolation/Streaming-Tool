namespace DSB.StreamBackend.Dtos;

/// <summary>
/// Represents the broadcast state for the streaming tool.
/// </summary>
public class BroadcastStateDto
{
    /// <summary>
    /// Gets or sets the name of Team Alpha.
    /// </summary>
    public string TeamAlphaName { get; set; } = "Team Alpha";

    /// <summary>
    /// Gets or sets the name of Team Bravo.
    /// </summary>
    public string TeamBravoName { get; set; } = "Team Bravo";

    /// <summary>
    /// Gets or sets a value indicating whether Team Alpha is displayed on the left.
    /// </summary>
    public bool AlphaIsLeft { get; set; } = true;

    /// <summary>
    /// Gets or sets the score for Team Alpha.
    /// </summary>
    public int ScoreAlpha { get; set; }

    /// <summary>
    /// Gets or sets the score for Team Bravo.
    /// </summary>
    public int ScoreBravo { get; set; }

    /// <summary>
    /// Sets the name of the streamer
    /// </summary>
    public string Streamer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the first commentator name.
    public string Commentator1 { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the second commentator name.
    /// </summary>
    public string Commentator2 { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets a value indicating whether the map screen is shown.
    /// </summary>
    public bool ShowMapScreen { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether the score box is shown.
    /// </summary>
    public bool ShowScoreBox { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether the commentator box is shown.
    /// </summary>
    public bool ShowCommentatorBox { get; set; } = true;

    /// <summary>
    /// Gets or sets a value indicating whether the infobox is shown.
    /// </summary>
    public bool ShowInfobox { get; set; } = true;

    /// <summary>
    /// Gets or sets the collection of map states.
    /// </summary>
    public List<MapStateDto> Maps { get; set; } = [];

    /// <summary>
    /// Gets or sets the current season number.
    /// </summary>
    public int Season { get; set; }

    /// <summary>
    /// Gets or sets the current division number.
    /// </summary>
    public int Division { get; set; }
}