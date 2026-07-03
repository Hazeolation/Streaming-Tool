using DSB.StreamBackend.Enums;

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

    /// <summary>
    /// Gets or sets the display mode in which the blending in and out happens
    /// 0 - Manual, the streamer has to click a button when the comm box should appear and disappear
    /// 1 - Automatic, the streamer can set two input time values and the comm box handles the blending automatically
    /// </summary>
    public int DisplayMode { get; set; } = Convert.ToInt32(CommBoxDisplayMode.Manual);
}
