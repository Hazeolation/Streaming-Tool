using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Logging;
using DSB.StreamBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DSB.StreamBackend.Services;

/// <summary>
/// Contains all business logic related to socials
/// </summary>
/// <param name="db">The database context</param>
public class SocialsService(StreamToolDbContext db, ILogService log)
{
    /// <summary>
    /// Asynchronously gets the socials
    /// </summary>
    /// <returns>A <see cref="Task"/> object returning a <see cref="SocialsDto"/></returns>
    public async Task<SocialsDto> GetSocialsAsync()
    {
        using IDisposable scope = log.BeginScope(nameof(GetSocialsAsync));

        await log.DebugAsync("Loading socials");

        try
        {
            SocialsEntity entity = await GetOrCreateSocialsAsync();

            await log.InfoAsync("Socials loaded", new
            {
                HasXHandle = !string.IsNullOrWhiteSpace(entity.XHandle),
                HasDiscordInvite = !string.IsNullOrWhiteSpace(entity.DiscordInvite)
            });

            return ToDto(entity);
        }
        catch (Exception ex)
        {
            await log.ErrorAsync("Failed to load socials", ex);
            throw;
        }
    }

    /// <summary>
    /// Asynchronously updates the socials
    /// </summary>
    /// <param name="dto">The <see cref="SocialsDto"/> containing the updated information</param>
    /// <returns>The updated <see cref="SocialsDto"/> object</returns>
    public async Task<SocialsDto> UpdateSocialsAsync(SocialsDto dto)
    {
        using IDisposable scope = log.BeginScope(nameof(UpdateSocialsAsync));

        await log.InfoAsync("Updating socials", new
        {
            dto.XHandle,
            HasDiscordInvite = !string.IsNullOrWhiteSpace(dto.DiscordInvite)
        });

        try
        {
            var entity = await GetOrCreateSocialsAsync();

            entity.XHandle = dto.XHandle;
            entity.DiscordInvite = dto.DiscordInvite;

            await db.SaveChangesAsync();

            await log.InfoAsync("Socials updated", new
            {
                entity.XHandle,
                HasDiscordInvite = !string.IsNullOrWhiteSpace(entity.DiscordInvite)
            });

            return ToDto(entity);
        }
        catch (Exception ex)
        {
            await log.ErrorAsync("Failed to update socials", ex, dto);
            throw;
        }
    }

    /// <summary>
    /// Asynchronously gets or creates the socials
    /// </summary>
    /// <returns>The <see cref="SocialsEntity"/></returns>
    private async Task<SocialsEntity> GetOrCreateSocialsAsync()
    {
        await log.TraceAsync("Loading socials entity");

        var entity = await db.Socials.FirstOrDefaultAsync(x => x.Id == 1);

        if (entity is not null)
        {
            await log.TraceAsync("Socials entity exists");
            return entity;
        }

        await log.WarningAsync("Socials not found, creating default");

        entity = new SocialsEntity
        {
            Id = 1
        };

        db.Socials.Add(entity);

        await db.SaveChangesAsync();

        await log.InfoAsync("Created socials");

        return entity;
    }

    /// <summary>
    /// Converts the <see cref="SocialsEntity"/> database context to a <see cref="SocialsDto"/>
    /// </summary>
    /// <param name="entity">The <see cref="SocialsEntity"/> to convert</param>
    /// <returns>The resulting <see cref="SocialsDto"/></returns>
    private static SocialsDto ToDto(SocialsEntity entity)
    {
        return new SocialsDto
        {
            XHandle = entity.XHandle,
            DiscordInvite = entity.DiscordInvite
        };
    }
}
