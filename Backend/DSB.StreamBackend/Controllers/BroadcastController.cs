using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Hubs;
using DSB.StreamBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DSB.StreamBackend.Controllers;

/// <summary>
/// Controller that exposes broadcast state endpoints for retrieval and updates.
/// </summary>
/// <param name="stateService">Service used to retrieve and update broadcast state.</param>
/// <param name="hub">SignalR hub context for notifying overlay clients of state changes.</param>
[ApiController]
[Route("api/broadcast")]
public class BroadcastController(
    BroadcastStateService stateService,
    IHubContext<OverlayHub, IOverlayClient> hub) : ControllerBase
{

    /// <summary>
    /// Retrieves the current broadcast state.
    /// </summary>
    /// <returns>The current broadcast state.</returns>
    [HttpGet("state")]
    public async Task<ActionResult<BroadcastStateDto>> GetState()
    {
        var state = await stateService.GetStateAsync();

        return Ok(state);
    }

    /// <summary>
    /// Updates the broadcast state and notifies all connected overlay clients of the change.
    /// </summary>
    /// <param name="state">The new broadcast state to apply.</param>
    /// <returns>The updated broadcast state.</returns>
    [HttpPost("state")]
    public async Task<ActionResult<BroadcastStateDto>> UpdateState(
        BroadcastStateDto state)
    {
        var updatedState =
            await stateService.UpdateStateAsync(state);

        await hub.Clients.All.BroadcastStateUpdated(updatedState);

        return Ok(updatedState);
    }
}