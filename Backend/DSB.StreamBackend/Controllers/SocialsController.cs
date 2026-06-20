using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Hubs;
using DSB.StreamBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace DSB.StreamBackend.Controllers;

/// <summary>
/// Controller that exposes broadcast state endpoints for retrieval and updates.
/// </summary>
/// <param name="socialsService">Service used to retrieve and update socials.</param>
/// <param name="hub">SignalR hub context for notifying overlay clients of socials changes.</param>
[ApiController]
[Route("api/socials")]
public class SocialsController(
    SocialsService socialsService,
    IHubContext<OverlayHub, IOverlayClient> hub) : ControllerBase
{

    /// <summary>
    /// Retrieves the current socials.
    /// </summary>
    /// <returns>The current socials.</returns>
    [HttpGet("socials")]
    public async Task<ActionResult<BroadcastStateDto>> GetSocials()
    {
        var socials = await socialsService.GetSocialsAsync();

        return Ok(socials);
    }

    /// <summary>
    /// Updates the socials and notifies all connected overlay clients of the change.
    /// </summary>
    /// <param name="socials">The new socials to apply.</param>
    /// <returns>The updated socials.</returns>
    [HttpPost("socials")]
    public async Task<ActionResult<SocialsDto>> UpdateSocials(
        SocialsDto socials)
    {
        var updatedSocials =
            await socialsService.UpdateSocialsAsync(socials);

        await hub.Clients.All.SocialsUpdated(updatedSocials);

        return Ok(updatedSocials);
    }
}