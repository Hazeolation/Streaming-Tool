using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DSB.StreamBackend.Services;

public class CommentatorBoxTimeDataService(StreamToolDbContext db)
{
    /// <summary>
    /// Asynchronously gets the commentator box time data
    /// </summary>
    /// <returns>A <see cref="Task"/> object returning a <see cref="CommentatorBoxTimeDataDto"/></returns>
    public async Task<CommentatorBoxTimeDataDto> GetCommentatorBoxTimeDataAsync()
    {
        CommentatorBoxTimeDataEntity entity = await GetOrCreateCommentatorBoxTimeDataAsync();
        return ToDto(entity);
    }

    /// <summary>
    /// Asynchronously updates the commentator box time data
    /// </summary>
    /// <param name="dto">The <see cref="CommentatorBoxTimeDataDto"/> containing the updated information</param>
    /// <returns>The updated <see cref="CommentatorBoxTimeDataDto"/> object</returns>
    public async Task<CommentatorBoxTimeDataDto> UpdateCommentatorBoxTimeDataAsync(CommentatorBoxTimeDataDto dto)
    {
        CommentatorBoxTimeDataEntity entity = await GetOrCreateCommentatorBoxTimeDataAsync();

        entity.Id = dto.Id;
        entity.HideDisplayIntervalInSeconds = dto.HideDisplayIntervalInSeconds;
        entity.ShowDisplayIntervalInSeconds = dto.ShowDisplayIntervalInSeconds;

        await db.SaveChangesAsync();

        return ToDto(entity);
    }

    /// <summary>
    /// Asynchronously gets or creates the CommentatorBoxTimeData
    /// </summary>
    /// <returns><see cref="CommentatorBoxTimeDataEntity"/></returns>
    private async Task <CommentatorBoxTimeDataEntity> GetOrCreateCommentatorBoxTimeDataAsync()
    {
        CommentatorBoxTimeDataEntity? entity = await db.CommentatorBoxTimeData
            .FirstOrDefaultAsync(x => x.Id == 1);

        if(entity != null) return entity;

        entity = new CommentatorBoxTimeDataEntity { Id = 1};
        db.CommentatorBoxTimeData.Add(entity);
        await db.SaveChangesAsync();
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
            ShowDisplayIntervalInSeconds = entity.ShowDisplayIntervalInSeconds,
        };
    }
}