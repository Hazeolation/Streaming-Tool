using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DSB.StreamBackend.Services;

public class BroadcastStateService(StreamToolDbContext db)
{
    /// <summary>
    /// Asynchronously gets the <see cref="BroadcastStateDto"/>
    /// </summary>
    /// <returns>A <see cref="Task"/> returning the state as <see cref="BroadcastStateDto"/></returns>
    public async Task<BroadcastStateDto> GetStateAsync()
    {
        var entity = await GetOrCreateStateAsync();
        return ToDto(entity);
    }

    /// <summary>
    /// Asynchronously updates the <see cref="BroadcastStateEntity"/>
    /// </summary>
    /// <param name="dto">The <see cref="BroadcastStateDto"/> containing the updated information</param>
    /// <returns>The updated <see cref="BroadcastStateDto"/></returns>
    public async Task<BroadcastStateDto> UpdateStateAsync(BroadcastStateDto dto)
    {
        var entity = await GetOrCreateStateAsync();

        entity.TeamAlphaName = dto.TeamAlphaName;
        entity.TeamBravoName = dto.TeamBravoName;
        entity.AlphaIsLeft = dto.AlphaIsLeft;

        entity.ScoreAlpha = dto.ScoreAlpha;
        entity.ScoreBravo = dto.ScoreBravo;

        entity.Streamer = dto.Streamer;

        entity.Commentator1 = dto.Commentator1;
        entity.Commentator2 = dto.Commentator2;

        entity.ShowMapScreen = dto.ShowMapScreen;
        entity.ShowScoreBox = dto.ShowScoreBox;
        entity.ShowCommentatorBox = dto.ShowCommentatorBox;
        entity.ShowInfobox = dto.ShowInfobox;

        entity.Season = dto.Season;
        entity.Division = dto.Division;

        UpdateMaps(entity, dto.Maps);

        await db.SaveChangesAsync();

        return ToDto(entity);
    }

    /// <summary>
    /// Asynchronously gets or creates the <see cref="BroadcastStateEntity"/> database context
    /// </summary>
    /// <returns>The <see cref="BroadcastStateEntity"/></returns>
    private async Task<BroadcastStateEntity> GetOrCreateStateAsync()
    {
        var entity = await db.BroadcastStates
            .Include(x => x.Maps)
            .FirstOrDefaultAsync(x => x.Id == 1);

        if (entity != null)
            return entity;

        entity = new BroadcastStateEntity { Id = 1 };
        db.BroadcastStates.Add(entity);
        await db.SaveChangesAsync();
        return entity;
    }

    /// <summary>
    /// Updates the maps contained in the <see cref="BroadcastStateEntity"/>
    /// </summary>
    /// <param name="entity">The <see cref="BroadcastStateEntity"/> database context</param>
    /// <param name="dtoMaps">A <see cref="List"/> of the <see cref="MapStateDto"/>s to update</param>
    private void UpdateMaps(BroadcastStateEntity entity, List<MapStateDto> dtoMaps)
    {
        var dtoIds = dtoMaps
            .Where(x => !string.IsNullOrEmpty(x.Id))
            .Select(x => x.Id)
            .ToHashSet();

        db.MapStates.RemoveRange(entity.Maps.Where(x => !dtoIds.Contains(x.Id)));

        foreach (var mapDto in dtoMaps.OrderBy(x => x.Order))
        {
            var existing = !string.IsNullOrEmpty(mapDto.Id)
                ? entity.Maps.FirstOrDefault(x => x.Id == mapDto.Id)
                : null;

            if (existing != null)
            {
                existing.Order = mapDto.Order;
                existing.MapId = mapDto.MapId;
                existing.MapName = mapDto.MapName;
                existing.ModeId = mapDto.ModeId;
                existing.ModeName = mapDto.ModeName;
                existing.ImageUrl = mapDto.ImageUrl;
                existing.Winner = mapDto.Winner;
                existing.IsVisible = mapDto.IsVisible;
            }
            else
            {
                entity.Maps.Add(new MapStateEntity
                {
                    Id = string.IsNullOrEmpty(mapDto.Id) ? Guid.NewGuid().ToString() : mapDto.Id,
                    Order = mapDto.Order,
                    MapId = mapDto.MapId,
                    MapName = mapDto.MapName,
                    ModeId = mapDto.ModeId,
                    ModeName = mapDto.ModeName,
                    ImageUrl = mapDto.ImageUrl,
                    Winner = mapDto.Winner,
                    IsVisible = mapDto.IsVisible,
                    BroadcastStateEntityId = 1
                });
            }
        }
    }

    /// <summary>
    /// Converts the <see cref="BroadcastStateEntity"/> database context to a <see cref="BroadcastStateDto"/>
    /// </summary>
    /// <param name="entity">The <see cref="BroadcastStateDto"/> to convert</param>
    /// <returns>The converted <see cref="BroadcastStateDto"/></returns>
    private static BroadcastStateDto ToDto(BroadcastStateEntity entity)
    {
        return new BroadcastStateDto
        {
            TeamAlphaName = entity.TeamAlphaName,
            TeamBravoName = entity.TeamBravoName,
            AlphaIsLeft = entity.AlphaIsLeft,

            ScoreAlpha = entity.ScoreAlpha,
            ScoreBravo = entity.ScoreBravo,

            Streamer = entity.Streamer,

            Commentator1 = entity.Commentator1,
            Commentator2 = entity.Commentator2,

            ShowMapScreen = entity.ShowMapScreen,
            ShowScoreBox = entity.ShowScoreBox,
            ShowCommentatorBox = entity.ShowCommentatorBox,
            ShowInfobox = entity.ShowInfobox,

            Maps = [.. entity.Maps
                .OrderBy(x => x.Order)
                .Select(x => new MapStateDto
                {
                    Id = x.Id,
                    Order = x.Order,
                    MapId = x.MapId,
                    MapName = x.MapName,
                    ModeId = x.ModeId,
                    ModeName = x.ModeName,
                    ImageUrl = x.ImageUrl,
                    Winner = x.Winner,
                    IsVisible = x.IsVisible
                })],

            Season = entity.Season,
            Division = entity.Division
        };
    }
}
