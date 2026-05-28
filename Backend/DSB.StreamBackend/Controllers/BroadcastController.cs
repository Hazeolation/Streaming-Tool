using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Hubs;
using DSB.StreamBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DSB.StreamBackend.Controllers;

[ApiController]
[Route("api/broadcast")]
public class BroadcastController : ControllerBase
{
    private readonly BroadcastStateService _stateService;

    private readonly IHubContext<OverlayHub> _hub;

    public BroadcastController(
        BroadcastStateService stateService,
        IHubContext<OverlayHub> hub)
    {
        _stateService = stateService;
        _hub = hub;
    }

    [HttpGet("state")]
    public async Task<ActionResult<BroadcastStateDto>> GetState()
    {
        var state = await _stateService.GetStateAsync();

        return Ok(state);
    }

    [HttpPost("state")]
    public async Task<ActionResult<BroadcastStateDto>> UpdateState(
        BroadcastStateDto state)
    {
        var updatedState =
            await _stateService.UpdateStateAsync(state);

        await _hub.Clients.All.SendAsync(
            "broadcastStateUpdated",
            updatedState);

        return Ok(updatedState);
    }
}