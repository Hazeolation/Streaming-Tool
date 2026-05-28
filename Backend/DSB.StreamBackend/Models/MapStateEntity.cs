namespace DSB.StreamBackend.Models;

public class MapStateEntity
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public int Order { get; set; }

    public string MapId { get; set; } = "";

    public string MapName { get; set; } = "";

    public string ModeId { get; set; } = "";

    public string ModeName { get; set; } = "";

    public string ImageUrl { get; set; } = "";

    public string? Winner { get; set; }

    public bool IsVisible { get; set; } = true;

    public int BroadcastStateEntityId { get; set; }

    public BroadcastStateEntity? BroadcastState { get; set; }
}