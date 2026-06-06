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
}
