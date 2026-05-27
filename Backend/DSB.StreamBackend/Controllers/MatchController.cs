using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using DSB.StreamBackend.Context;
using DSB.StreamBackend.DTOs;
using DSB.StreamBackend.Hubs;

namespace DSB.StreamBackend.Controllers;

/// <summary>
/// Controller for handling match related API endpoints.
/// </summary>
/// <param name="dbContext">The database context.</param>
[ApiController]
[Route("api/matches")]
public class MatchController(StreamToolDbContext dbContext, IHubContext<OverlayHub> hubContext) : ControllerBase
{
    /// <summary>
    /// The database context used for accessing match data.
    /// </summary>
    private readonly StreamToolDbContext _dbContext = dbContext;

    private readonly IHubContext<OverlayHub> _hubContext = hubContext;

    [HttpPost("{id}/score")]
    public async Task<IActionResult> UpdateScore(Guid id, UpdateScoreDto dto)
    {
        var match = await _dbContext.Matches.FindAsync(id);

        if (match == null) return NotFound();

        match.ScoreA = dto.ScoreA;
        match.ScoreB = dto.ScoreB;

        await _dbContext.SaveChangesAsync();

        await _hubContext.Clients.All.SendAsync(
            "scoreUpdated",
            new
            {
                match.ScoreA,
                match.ScoreB
            });

        return Ok();
    }
}