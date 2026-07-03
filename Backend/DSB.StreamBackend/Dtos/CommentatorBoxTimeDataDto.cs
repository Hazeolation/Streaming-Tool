namespace DSB.StreamBackend.Dtos;

/// <summary>
/// Represents the time data for commentator box display settings
/// </summary>
public class CommentatorBoxTimeDataDto
{
    /// <summary>
    /// Gets or sets the single identifier for the commentator box time data
    /// </summary>
    public int Id { get; set; } = 1;
    
    /// <summary>
    /// Gets or sets the time in seconds that the display should be visible
    /// </summary>
    public int ShowDisplayIntervalInSeconds { get; set; } = 0;

    /// <summary>
    /// Gets or sets the time in seconds that the display should be hidden
    /// </summary>
    public int HideDisplayIntervalInSeconds { get; set; } = 0;
}
