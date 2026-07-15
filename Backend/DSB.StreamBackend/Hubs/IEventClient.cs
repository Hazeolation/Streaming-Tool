namespace DSB.StreamBackend.Hubs;

/// <summary>
/// Defines client-side event callbacks that can be invoked from the server.
/// </summary>
public interface IEventClient
{
    /// <summary>
    /// Sends the button click event that hides the commentator box to connected event clients.
    /// </summary>
    Task CommBoxHideButtonClicked();

    /// <summary>
    /// Sends the button click event that shows the commentator box to connected event clients.
    /// </summary>
    Task CommBoxShowButtonClicked();

    /// <summary>
    /// Sends the button click event that shows the commentator box temporarily to connected event clients.
    /// </summary>
    Task CommBoxShowTempButtonClicked();
}
