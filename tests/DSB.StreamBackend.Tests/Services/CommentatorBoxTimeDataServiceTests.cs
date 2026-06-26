using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Models;
using DSB.StreamBackend.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace DSB.StreamBackend.Tests.Services;

[TestFixture]
public class CommentatorBoxTimeDataServiceTests
{
    private StreamToolDbContext _db = null!;
    private CommentatorBoxTimeDataService _service = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<StreamToolDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new StreamToolDbContext(options);
        _service = new CommentatorBoxTimeDataService(_db);
    }

    [TearDown]
    public void TearDown() => _db.Dispose();

    [Test]
    public async Task GetTimeDataAsync_WhenNoTimeDataExists_CreatesAndReturnsDefaultTimeData()
    {
        var result = await _service.GetCommentatorBoxTimeDataAsync();

        Assert.That(result, Is.Not.Null);
        Assert.That(result.ShowDisplayIntervalInSeconds, Is.EqualTo(0));
        Assert.That(result.HideDisplayIntervalInSeconds, Is.EqualTo(0));
    }

    [Test]
    public async Task GetTimeDataAsync_WhenTimeDataExists_ReturnsPersisted()
    {
        _db.CommentatorBoxTimeData.Add(new CommentatorBoxTimeDataEntity
        {
            Id = 1,
            ShowDisplayIntervalInSeconds = 40,
            HideDisplayIntervalInSeconds = 60
        });
        await _db.SaveChangesAsync();

        var result = await _service.GetCommentatorBoxTimeDataAsync();

        Assert.That(result.ShowDisplayIntervalInSeconds, Is.EqualTo(40));
        Assert.That(result.HideDisplayIntervalInSeconds, Is.EqualTo(60));
    }

    [Test]
    public async Task UpdateTimeDataAsync_UpdatesAllFields()
    {
        var dto = new CommentatorBoxTimeDataDto
        {
            ShowDisplayIntervalInSeconds = 76,
            HideDisplayIntervalInSeconds = 67
        };

        var result = await _service.UpdateCommentatorBoxTimeDataAsync(dto);

        Assert.That(result.ShowDisplayIntervalInSeconds, Is.EqualTo(76));
        Assert.That(result.HideDisplayIntervalInSeconds, Is.EqualTo(67));
    }

    [Test]
    public async Task UpdateTimeDataAsync_PersistsChangesToDatabase()
    {
        var dto = new CommentatorBoxTimeDataDto
        {
            ShowDisplayIntervalInSeconds = 50,
            HideDisplayIntervalInSeconds = 25
        };

        await _service.UpdateCommentatorBoxTimeDataAsync(dto);

        var entity = await _db.CommentatorBoxTimeData.FirstAsync(x => x.Id == 1);
        Assert.That(entity.HideDisplayIntervalInSeconds, Is.EqualTo(25));
    }
}