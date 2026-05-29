namespace DSB.StreamBackend.Dtos;

public class MapStateDto
{
    public string Id { get; set; } = string.Empty;

    public int Order { get; set; }

    public string MapId { get; set; } = string.Empty;

    public string MapName { get; set; } = string.Empty;

    public string ModeId { get; set; } = string.Empty;

    public string ModeName { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string? Winner { get; set; }

    public bool IsVisible { get; set; }
}