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
using DSB.StreamBackend.Logging;

namespace DSB.StreamBackend.Tests.Controllers;

[TestFixture]
public class BroadcastControllerTests
{
    private StreamToolDbContext _db = null!;
    private LogService _log = null!;
    private ILogSink[] _logSinks = null!;
    private BroadcastStateService _service = null!;
    private Mock<IHubContext<OverlayHub, IOverlayClient>> _hubContextMock = null!;
    private Mock<IHubClients<IOverlayClient>> _hubClientsMock = null!;
    private Mock<IOverlayClient> _overlayClientMock = null!;
    private BroadcastController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<StreamToolDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new StreamToolDbContext(options);
        _logSinks = [new ConsoleLogSink()];
        _log = new LogService(_logSinks);
        _service = new BroadcastStateService(_db, _log);

        _overlayClientMock = new Mock<IOverlayClient>();
        _hubClientsMock = new Mock<IHubClients<IOverlayClient>>();
        _hubClientsMock.Setup(x => x.All).Returns(_overlayClientMock.Object);

        _hubContextMock = new Mock<IHubContext<OverlayHub, IOverlayClient>>();
        _hubContextMock.Setup(x => x.Clients).Returns(_hubClientsMock.Object);

        _controller = new BroadcastController(_service, _hubContextMock.Object, _log);
    }

    [TearDown]
    public void TearDown() => _db.Dispose();

    [Test]
    public async Task GetState_ReturnsOkWithState()
    {
        var result = await _controller.GetState();

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var ok = (OkObjectResult)result.Result!;
        Assert.That(ok.Value, Is.InstanceOf<BroadcastStateDto>());
    }

    [Test]
    public async Task GetState_ReturnsCurrentBroadcastState()
    {
        var result = await _controller.GetState();

        var ok = (OkObjectResult)result.Result!;
        var dto = (BroadcastStateDto)ok.Value!;

        Assert.That(dto.TeamAlphaName, Is.EqualTo("Team Alpha"));
        Assert.That(dto.TeamBravoName, Is.EqualTo("Team Bravo"));
    }

    [Test]
    public async Task UpdateState_ReturnsOkWithUpdatedState()
    {
        var dto = new BroadcastStateDto
        {
            TeamAlphaName = "Updated Alpha",
            TeamBravoName = "Updated Bravo",
            Maps = []
        };

        var result = await _controller.UpdateState(dto);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var ok = (OkObjectResult)result.Result!;
        var updated = (BroadcastStateDto)ok.Value!;

        Assert.That(updated.TeamAlphaName, Is.EqualTo("Updated Alpha"));
        Assert.That(updated.TeamBravoName, Is.EqualTo("Updated Bravo"));
    }

    [Test]
    public async Task UpdateState_NotifiesAllOverlayClients()
    {
        var dto = new BroadcastStateDto { Maps = [] };

        await _controller.UpdateState(dto);

        _overlayClientMock.Verify(
            x => x.BroadcastStateUpdated(It.IsAny<BroadcastStateDto>()),
            Times.Once);
    }

    [Test]
    public async Task UpdateState_SendsUpdatedStateToOverlayClients()
    {
        BroadcastStateDto? capturedState = null;
        _overlayClientMock
            .Setup(x => x.BroadcastStateUpdated(It.IsAny<BroadcastStateDto>()))
            .Callback<BroadcastStateDto>(s => capturedState = s)
            .Returns(Task.CompletedTask);

        var dto = new BroadcastStateDto
        {
            TeamAlphaName = "SignalR Team",
            Maps = []
        };

        await _controller.UpdateState(dto);

        Assert.That(capturedState, Is.Not.Null);
        Assert.That(capturedState!.TeamAlphaName, Is.EqualTo("SignalR Team"));
    }
}
