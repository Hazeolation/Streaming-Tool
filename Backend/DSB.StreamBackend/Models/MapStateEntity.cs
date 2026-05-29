namespace DSB.StreamBackend.Models;

public class MapStateEntity
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public int Order { get; set; }

    public string MapId { get; set; } = string.Empty;

    public string MapName { get; set; } = string.Empty;

    public string ModeId { get; set; } = string.Empty;

    public string ModeName { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string? Winner { get; set; }

    public bool IsVisible { get; set; } = true;

    public int BroadcastStateEntityId { get; set; }

    public BroadcastStateEntity? BroadcastState { get; set; }
}