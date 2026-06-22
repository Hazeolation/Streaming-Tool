using DSB.StreamBackend.Controllers;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Hubs;
using DSB.StreamBackend.Services;
using DSB.StreamBackend.Context;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;

namespace DSB.StreamBackend.Tests.Controllers;

[TestFixture]
public class SocialsControllerTests
{
    private StreamToolDbContext _db = null!;
    private SocialsService _service = null!;
    private Mock<IHubContext<OverlayHub, IOverlayClient>> _hubContextMock = null!;
    private Mock<IHubClients<IOverlayClient>> _hubClientsMock = null!;
    private Mock<IOverlayClient> _overlayClientMock = null!;
    private SocialsController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<StreamToolDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new StreamToolDbContext(options);
        _service = new SocialsService(_db);

        _overlayClientMock = new Mock<IOverlayClient>();
        _hubClientsMock = new Mock<IHubClients<IOverlayClient>>();
        _hubClientsMock.Setup(x => x.All).Returns(_overlayClientMock.Object);

        _hubContextMock = new Mock<IHubContext<OverlayHub, IOverlayClient>>();
        _hubContextMock.Setup(x => x.Clients).Returns(_hubClientsMock.Object);

        _controller = new SocialsController(_service, _hubContextMock.Object);
    }

    [TearDown]
    public void TearDown() => _db.Dispose();

    [Test]
    public async Task GetSocials_ReturnsOkWithSocials()
    {
        var result = await _controller.GetSocials();

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var ok = (OkObjectResult)result.Result!;
        Assert.That(ok.Value, Is.InstanceOf<SocialsDto>());
    }

    [Test]
    public async Task GetSocials_ReturnsCurrentSocials()
    {
        var result = await _controller.GetSocials();

        var ok = (OkObjectResult)result.Result!;
        var dto = (SocialsDto)ok.Value!;

        Assert.That(dto.XHandle, Is.EqualTo(string.Empty));
        Assert.That(dto.DiscordInvite, Is.EqualTo(string.Empty));
    }

    [Test]
    public async Task UpdateSocials_ReturnsOkWithUpdatedSocials()
    {
        var dto = new SocialsDto
        {
            XHandle = "New Handle",
        };

        var result = await _controller.UpdateSocials(dto);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var ok = (OkObjectResult)result.Result!;
        var updated = (SocialsDto)ok.Value!;

        Assert.That(updated.XHandle, Is.EqualTo("New Handle"));
        Assert.That(updated.DiscordInvite, Is.EqualTo(string.Empty));
    }

    [Test]
    public async Task UpdateSocials_NotifiesAllOverlayClients()
    {
        var dto = new SocialsDto { XHandle = "@DSB" };

        await _controller.UpdateSocials(dto);

        _overlayClientMock.Verify(
            x => x.SocialsUpdated(It.IsAny<SocialsDto>()),
            Times.Once);
    }

    [Test]
    public async Task UpdateSocials_SendsUpdatedSocialsToOverlayClients()
    {
        SocialsDto? capturedSocials = null;
        _overlayClientMock
            .Setup(x => x.SocialsUpdated(It.IsAny<SocialsDto>()))
            .Callback<SocialsDto>(s => capturedSocials = s)
            .Returns(Task.CompletedTask);

        var dto = new SocialsDto
        {
            XHandle = "@DSB",
            DiscordInvite = "/dsb"
        };

        await _controller.UpdateSocials(dto);

        Assert.That(capturedSocials, Is.Not.Null);
        Assert.That(capturedSocials!.XHandle, Is.EqualTo("@DSB"));
        Assert.That(capturedSocials!.DiscordInvite, Is.EqualTo("/dsb"));
    }
}
