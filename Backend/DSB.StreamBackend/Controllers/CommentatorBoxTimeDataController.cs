using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Hubs;
using DSB.StreamBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DSB.StreamBackend.Controllers;

/// <summary>
/// Controller that exposes commentator box time data endpoints for retrieval and updates.
/// </summary>
/// <param name="timeDataService">Service used to retrieve and update time data.</param>
/// <param name="hub">SignalR hub context for notifying overlay clients of time data changes.</param>
[ApiController]
[Route("api/commentator-box-time-data")]
public class CommentatorBoxTimeDataController(
    CommentatorBoxTimeDataService timeDataService,
    IHubContext<OverlayHub, IOverlayClient> hub) : ControllerBase
{
    /// <summary>
    /// Retrieves the current commentator box time data.
    /// </summary>
    /// <returns>The current commentator box time data.</returns>
    [HttpGet("commentator-box-time-data")]
    public async Task<ActionResult<CommentatorBoxTimeDataDto>> GetCommentatorBoxTimeData()
    {
        CommentatorBoxTimeDataDto timeData = await timeDataService.GetCommentatorBoxTimeDataAsync();

        return Ok(timeData);
    }

    /// <summary>
    /// Updates the commentator box time data and notifies all connected overlay clients of the change.
    /// </summary>
    /// <param name="timeData">The new commentator box time data to apply.</param>
    /// <returns>The updated commentator box time data.</returns>
    [HttpPost("commentator-box-time-data")]
    public async Task<ActionResult<CommentatorBoxTimeDataDto>> UpdateCommentatorBoxTimeData(
        CommentatorBoxTimeDataDto timeData)
    {
        CommentatorBoxTimeDataDto updatedTimeData = await timeDataService.UpdateCommentatorBoxTimeDataAsync(timeData);

        await hub.Clients.All.CommentatorBoxTimeDataUpdated(updatedTimeData);

        return Ok(updatedTimeData);
    }
}