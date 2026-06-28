#pragma warning disable CS4014 // Disabled because Logging is intended to not be awaited

using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DSB.StreamBackend.Services;

public class CommentatorBoxTimeDataService(StreamToolDbContext db, LogService log)
{
    /// <summary>
    /// Asynchronously gets the commentator box time data
    /// </summary>
    /// <returns>A <see cref="Task"/> object returning a <see cref="CommentatorBoxTimeDataDto"/></returns>
    public async Task<CommentatorBoxTimeDataDto> GetCommentatorBoxTimeDataAsync()
    {
        using IDisposable scope = log.BeginScope(nameof(GetCommentatorBoxTimeDataAsync));

        log.DebugAsync("Loading commentator box time data");

        try
        {
            var entity = await GetOrCreateCommentatorBoxTimeDataAsync();

            log.InfoAsync("Commentator box time data loaded", new
            {
                entity.ShowDisplayIntervalInSeconds,
                entity.HideDisplayIntervalInSeconds
            });

            return ToDto(entity);
        }
        catch (Exception ex)
        {
            log.ErrorAsync("Failed to load commentator box time data", ex);
            throw;
        }
    }

    /// <summary>
    /// Asynchronously updates the commentator box time data
    /// </summary>
    /// <param name="dto">The <see cref="CommentatorBoxTimeDataDto"/> containing the updated information</param>
    /// <returns>The updated <see cref="CommentatorBoxTimeDataDto"/> object</returns>
    public async Task<CommentatorBoxTimeDataDto> UpdateCommentatorBoxTimeDataAsync(CommentatorBoxTimeDataDto dto)
    {
        using var scope = log.BeginScope(nameof(UpdateCommentatorBoxTimeDataAsync));

        log.InfoAsync("Updating commentator box time data", dto);

        try
        {
            var entity = await GetOrCreateCommentatorBoxTimeDataAsync();

            entity.HideDisplayIntervalInSeconds = dto.HideDisplayIntervalInSeconds;

            entity.ShowDisplayIntervalInSeconds = dto.ShowDisplayIntervalInSeconds;

            await db.SaveChangesAsync();

            log.InfoAsync("Commentator box time data updated", new
            {
                entity.ShowDisplayIntervalInSeconds,
                entity.HideDisplayIntervalInSeconds
            });

            return ToDto(entity);
        }
        catch (Exception ex)
        {
            log.ErrorAsync("Failed to update commentator box time data", ex, dto);
            throw;
        }
    }

    /// <summary>
    /// Asynchronously gets or creates the CommentatorBoxTimeData
    /// </summary>
    /// <returns><see cref="CommentatorBoxTimeDataEntity"/></returns>
    private async Task<CommentatorBoxTimeDataEntity> GetOrCreateCommentatorBoxTimeDataAsync()
    {
        log.TraceAsync("Loading commentator box time entity");

        var entity = await db.CommentatorBoxTimeData.FirstOrDefaultAsync(x => x.Id == 1);

        if (entity is not null)
        {
            return entity;
        }

        log.WarningAsync("Commentator box time data not found, creating default");

        entity = new CommentatorBoxTimeDataEntity
        {
            Id = 1
        };

        db.CommentatorBoxTimeData.Add(entity);

        await db.SaveChangesAsync();

        log.InfoAsync("Created commentator box time data");

        return entity;
    }

    /// <summary>
    /// Converts the <see cref="CommentatorBoxTimeDataEntity"/> database context to a <see cref="CommentatorBoxTimeDataDto"/>
    /// </summary>
    /// <param name="entity">The <see cref="CommentatorBoxTimeDataEntity"/> to convert</param>
    /// <returns>The resulting <see cref="CommentatorBoxTimeDataDto"/></returns>
    private static CommentatorBoxTimeDataDto ToDto(CommentatorBoxTimeDataEntity entity)
    {
        return new CommentatorBoxTimeDataDto
        {
            HideDisplayIntervalInSeconds = entity.HideDisplayIntervalInSeconds,

            ShowDisplayIntervalInSeconds = entity.ShowDisplayIntervalInSeconds
        };
    }
}