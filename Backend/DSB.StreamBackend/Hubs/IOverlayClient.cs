using DSB.StreamBackend.Dtos;

namespace DSB.StreamBackend.Hubs;

public interface IOverlayClient
{
    Task BroadcastStateUpdated(BroadcastStateDto state);
}
