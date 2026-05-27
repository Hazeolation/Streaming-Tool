namespace DSB.StreamBackend.Models;

/// <summary>
/// Represents a player in the DSB streaming tool.
/// </summary>
public class Player
{
    /// <summary>
    /// Gets or sets the unique identifier for the player.
    /// </summary>
    public Guid Id { get; set; }

    /// <summary>
    /// Gets or sets the unique identifier for the team that the player belongs to.
    /// </summary>
    public Guid? TeamId { get; set; }

    /// <summary>
    /// Gets or sets the name of the player.
    /// </summary>
    public string Name { get; set; }
}