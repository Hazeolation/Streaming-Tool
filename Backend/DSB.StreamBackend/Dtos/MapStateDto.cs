namespace DSB.StreamBackend.Dtos;

public class MapStateDto
{
    public string Id { get; set; } = "";

    public int Order { get; set; }

    public string MapId { get; set; } = "";

    public string MapName { get; set; } = "";

    public string ModeId { get; set; } = "";

    public string ModeName { get; set; } = "";

    public string ImageUrl { get; set; } = "";

    public string? Winner { get; set; }

    public bool IsVisible { get; set; }
}