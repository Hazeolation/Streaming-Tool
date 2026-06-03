namespace DSB.StreamBackend.Models;

public class BroadcastStateEntity
{
    public int Id { get; set; } = 1;

    public string TeamAlphaName { get; set; } = "Team Alpha";

    public string TeamBravoName { get; set; } = "Team Bravo";

    public bool AlphaIsLeft { get; set; } = true;

    public int ScoreAlpha { get; set; }

    public int ScoreBravo { get; set; }

    /// <summary>
    /// Sets the name of the streamer
    /// </summary>
    public string Streamer { get; set; } = String.Empty;

    public string Commentator1 { get; set; } = "";

    public string Commentator2 { get; set; } = "";

    public bool ShowMapScreen { get; set; } = true;

    public bool ShowScoreBox { get; set; } = true;

    public bool ShowCommentatorBox { get; set; } = true;

    public bool ShowInfobox { get; set; } = true;

    public List<MapStateEntity> Maps { get; set; } = [];

    public int Season { get; set; }

    public int Division { get; set; }
}
