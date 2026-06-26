using DSB.StreamBackend.Dtos;

namespace DSB.StreamBackend.Hubs;

/// <summary>
/// Defines client-side overlay callbacks that can be invoked from the server.
/// </summary>
public interface IOverlayClient
{
    /// <summary>
    /// Sends an updated broadcast state to connected overlay clients.
    /// </summary>
    /// <param name="state">The latest broadcast state data.</param>
    Task BroadcastStateUpdated(BroadcastStateDto state);

    /// <summary>
    /// Sends updated socials to connected overlay clients.
    /// </summary>
    /// <param name="socials">The latest socials data.</param>
    Task SocialsUpdated(SocialsDto socials);

    /// <summary>
    /// Sends updated commentator box time data to connected overlay clients.
    /// </summary>
    /// <param name="timeData">The latest commentator box time data.</param>
    Task CommentatorBoxTimeDataUpdated(CommentatorBoxTimeDataDto timeData);
}
