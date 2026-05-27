namespace DSB.StreamBackend.Models;

public class BroadcastState
{
    public int Id { get; set; }

    public Guid? CurrentMatch { get; set; }

    public bool IsLive { get; set; } = false;
}