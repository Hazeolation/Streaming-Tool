using DSB.StreamBackend.Context;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Logging;
using DSB.StreamBackend.Models;
using DSB.StreamBackend.Services;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace DSB.StreamBackend.Tests.Services;

[TestFixture]
public class SocialsServiceTests
{
    private StreamToolDbContext _db = null!;
    private LogService _log = null!;
    private ILogSink[] _logSinks = null!;
    private SocialsService _service = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<StreamToolDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new StreamToolDbContext(options);
        _logSinks = [new ConsoleLogSink()];
        _log = new LogService(_logSinks);
        _service = new SocialsService(_db, _log);
    }

    [TearDown]
    public void TearDown() => _db.Dispose();

    [Test]
    public async Task GetSocialsAsync_WhenNoSocialsExists_CreatesAndReturnsDefaultSocials()
    {
        var result = await _service.GetSocialsAsync();

        Assert.That(result, Is.Not.Null);
        Assert.That(result.XHandle, Is.EqualTo(string.Empty));
        Assert.That(result.DiscordInvite, Is.EqualTo(string.Empty));
    }

    [Test]
    public async Task GetSocialsAsync_WhenSocialsExists_ReturnsPersisted()
    {
        _db.Socials.Add(new SocialsEntity
        {
            Id = 1,
            XHandle = "@DSB",
            DiscordInvite = "/dsb"
        });
        await _db.SaveChangesAsync();

        var result = await _service.GetSocialsAsync();

        Assert.That(result.XHandle, Is.EqualTo("@DSB"));
        Assert.That(result.DiscordInvite, Is.EqualTo("/dsb"));
    }

    [Test]
    public async Task UpdateSocialsAsync_UpdatesAllFields()
    {
        var dto = new SocialsDto
        {
            XHandle = "@DSB",
            DiscordInvite = "/dsb"
        };

        var result = await _service.UpdateSocialsAsync(dto);

        Assert.That(result.XHandle, Is.EqualTo("@DSB"));
        Assert.That(result.DiscordInvite, Is.EqualTo("/dsb"));
    }

    [Test]
    public async Task UpdateSocialsAsync_PersistsChangesToDatabase()
    {
        var dto = new SocialsDto
        {
            XHandle = "@DSBPersistent",
            DiscordInvite = "/dsb"
        };

        await _service.UpdateSocialsAsync(dto);

        var entity = await _db.Socials.FirstAsync(x => x.Id == 1);
        Assert.That(entity.XHandle, Is.EqualTo("@DSBPersistent"));
    }
}
