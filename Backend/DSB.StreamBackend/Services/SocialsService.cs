using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DSB.StreamBackend.Services;

/// <summary>
/// Contains all business logic related to socials
/// </summary>
/// <param name="db">The database context</param>
public class SocialsService(StreamToolDbContext db)
{
    /// <summary>
    /// Asynchronously gets the socials
    /// </summary>
    /// <returns>A <see cref="Task"/> object returning a <see cref="SocialsDto"/></returns>
    public async Task<SocialsDto> GetSocialsAsync()
    {
        var entity = await GetOrCreateSocialsAsync();
        return ToDto(entity);
    }

    /// <summary>
    /// Asynchronously updates the socials
    /// </summary>
    /// <param name="dto">The <see cref="SocialsDto"/> containing the updated information</param>
    /// <returns>The updated <see cref="SocialsDto"/> object</returns>
    public async Task<SocialsDto> UpdateSocialsAsync(SocialsDto dto)
    {
        SocialsEntity entity = await GetOrCreateSocialsAsync();

        entity.Id = dto.Id;
        entity.XHandle = dto.XHandle;
        entity.DiscordInvite = dto.DiscordInvite;

        await db.SaveChangesAsync();

        return ToDto(entity);
    }

    /// <summary>
    /// Asynchronously gets or creates the socials
    /// </summary>
    /// <returns>The <see cref="SocialsEntity"/></returns>
    private async Task<SocialsEntity> GetOrCreateSocialsAsync()
    {
        /* var entity = await db.Socials
            .FirstOrDefaultAsync(x => x.Id == 1);

        if (entity != null) return entity;

        entity = new SocialsEntity { Id = 1 };
        db.Socials.Add(entity);
        await db.SaveChangesAsync();
        return entity; */
        return null;
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
