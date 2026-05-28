using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace DSB.StreamBackend.Services;

public class BroadcastStateService(StreamToolDbContext db)
{
    public async Task<BroadcastStateDto> GetStateAsync()
    {
        var entity = await db.BroadcastStates
            .Include(x => x.Maps)
            .FirstOrDefaultAsync(x => x.Id == 1);

        if (entity == null)
        {
            entity = new BroadcastStateEntity
            {
                Id = 1
            };

            db.BroadcastStates.Add(entity);

            await db.SaveChangesAsync();
        }

        return ToDto(entity);
    }

    public async Task<BroadcastStateDto> UpdateStateAsync(
        BroadcastStateDto dto)
    {
        var entity = await db.BroadcastStates
            .Include(x => x.Maps)
            .FirstOrDefaultAsync(x => x.Id == 1);

        if (entity == null)
        {
            entity = new BroadcastStateEntity
            {
                Id = 1
            };

            db.BroadcastStates.Add(entity);
        }

        entity.TeamAlphaName = dto.TeamAlphaName;
        entity.TeamBravoName = dto.TeamBravoName;
        entity.AlphaIsLeft = dto.AlphaIsLeft;

        entity.ScoreAlpha = dto.ScoreAlpha;
        entity.ScoreBravo = dto.ScoreBravo;

        entity.Commentator1 = dto.Commentator1;
        entity.Commentator2 = dto.Commentator2;

        entity.ShowMapScreen = dto.ShowMapScreen;
        entity.ShowScoreBox = dto.ShowScoreBox;
        entity.ShowCommentatorBox = dto.ShowCommentatorBox;
        entity.ShowInfobox = dto.ShowInfobox;

        db.MapStates.RemoveRange(entity.Maps);

        entity.Maps = dto.Maps
            .OrderBy(x => x.Order)
            .Select(x => new MapStateEntity
            {
                Id = x.Id,
                Order = x.Order,
                MapId = x.MapId,
                MapName = x.MapName,
                ModeId = x.ModeId,
                ModeName = x.ModeName,
                ImageUrl = x.ImageUrl,
                Winner = x.Winner,
                IsVisible = x.IsVisible,
                BroadcastStateEntityId = 1
            })
            .ToList();

        await db.SaveChangesAsync();

        return ToDto(entity);
    }

    private static BroadcastStateDto ToDto(
        BroadcastStateEntity entity)
    {
        return new BroadcastStateDto
        {
            TeamAlphaName = entity.TeamAlphaName,
            TeamBravoName = entity.TeamBravoName,
            AlphaIsLeft = entity.AlphaIsLeft,

            ScoreAlpha = entity.ScoreAlpha,
            ScoreBravo = entity.ScoreBravo,

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
                })]
        };
    }
}