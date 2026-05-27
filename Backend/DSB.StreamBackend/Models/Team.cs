namespace DSB.StreamBackend.Models;

/// <summary>
/// Represents a team in the DSB streaming tool.
/// </summary>
public class Team
{
    /// <summary>
    /// Gets or sets the unique identifier for the team.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the name of the team.
    /// </summary>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the tag of the team, which is a short identifier often used in esports.
    /// </summary>
    public string? Tag { get; set; }

    /// <summary>
    /// Gets or sets the URL of the team's logo.
    /// </summary>
    public string? LogoUrl { get; set; }
}