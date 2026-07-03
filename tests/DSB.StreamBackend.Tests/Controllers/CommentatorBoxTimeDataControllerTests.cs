using DSB.StreamBackend.Context;
using DSB.StreamBackend.Controllers;
using DSB.StreamBackend.Dtos;
using DSB.StreamBackend.Hubs;
using DSB.StreamBackend.Logging;
using DSB.StreamBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using NUnit.Framework;

namespace DSB.StreamBackend.Tests.Controllers;

[TestFixture]
public class CommentatorBoxTimeDataControllerTests
{
    private StreamToolDbContext _db = null!;
    private LogService _log = null!;
    private ILogSink[] _logSinks = null!;
    private CommentatorBoxTimeDataService _service = null!;
    private Mock<IHubContext<OverlayHub, IOverlayClient>> _hubContextMock = null!;
    private Mock<IHubClients<IOverlayClient>> _hubClientsMock = null!;
    private Mock<IOverlayClient> _overlayClientMock = null!;
    private CommentatorBoxTimeDataController _controller = null!;

    [SetUp]
    public void SetUp()
    {
        var options = new DbContextOptionsBuilder<StreamToolDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        _db = new StreamToolDbContext(options);
        _logSinks = [new ConsoleLogSink()];
        _log = new LogService(_logSinks);
        _service = new CommentatorBoxTimeDataService(_db, _log);

        _overlayClientMock = new Mock<IOverlayClient>();
        _hubClientsMock = new Mock<IHubClients<IOverlayClient>>();
        _hubClientsMock.Setup(x => x.All).Returns(_overlayClientMock.Object);

        _hubContextMock = new Mock<IHubContext<OverlayHub, IOverlayClient>>();
        _hubContextMock.Setup(x => x.Clients).Returns(_hubClientsMock.Object);

        _controller = new CommentatorBoxTimeDataController(_service, _hubContextMock.Object, _log);
    }

    [TearDown]
    public void TearDown() => _db.Dispose();

    [Test]
    public async Task GetTimeData_ReturnsOkWithTimeData()
    {
        var result = await _controller.GetCommentatorBoxTimeData();

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var ok = (OkObjectResult)result.Result!;
        Assert.That(ok.Value, Is.InstanceOf<CommentatorBoxTimeDataDto>());
    }

    [Test]
    public async Task GetTimeData_ReturnsCurrentTimeData()
    {
        var result = await _controller.GetCommentatorBoxTimeData();

        var ok = (OkObjectResult)result.Result!;
        var dto = (CommentatorBoxTimeDataDto)ok.Value!;

        Assert.That(dto.ShowDisplayIntervalInSeconds, Is.EqualTo(5));
        Assert.That(dto.HideDisplayIntervalInSeconds, Is.EqualTo(50));
    }

    [Test]
    public async Task UpdateTimeData_ReturnsOkWithUpdatedTimeData()
    {
        var dto = new CommentatorBoxTimeDataDto
        {
            ShowDisplayIntervalInSeconds = 200
        };

        var result = await _controller.UpdateCommentatorBoxTimeData(dto);

        Assert.That(result.Result, Is.InstanceOf<OkObjectResult>());
        var ok = (OkObjectResult)result.Result!;
        var updated = (CommentatorBoxTimeDataDto)ok.Value!;

        Assert.That(updated.ShowDisplayIntervalInSeconds, Is.EqualTo(200));
        Assert.That(updated.HideDisplayIntervalInSeconds, Is.EqualTo(0));
    }

    [Test]
    public async Task UpdateTimeData_NotifiesAllOverlayClients()
    {
        var dto = new CommentatorBoxTimeDataDto { HideDisplayIntervalInSeconds = 100 };

        await _controller.UpdateCommentatorBoxTimeData(dto);

        _overlayClientMock.Verify(
            x => x.CommentatorBoxTimeDataUpdated(It.IsAny<CommentatorBoxTimeDataDto>()),
            Times.Once);
    }

    [Test]
    public async Task UpdateTimeData_SendsUpdatedTimeDataToOverlayClients()
    {
        CommentatorBoxTimeDataDto? capturedTimeData = null;
        _overlayClientMock
            .Setup(x => x.CommentatorBoxTimeDataUpdated(It.IsAny<CommentatorBoxTimeDataDto>()))
            .Callback<CommentatorBoxTimeDataDto>(s => capturedTimeData = s)
            .Returns(Task.CompletedTask);

        var dto = new CommentatorBoxTimeDataDto
        {
            ShowDisplayIntervalInSeconds = 20,
            HideDisplayIntervalInSeconds = 40
        };

        await _controller.UpdateCommentatorBoxTimeData(dto);

        Assert.That(capturedTimeData, Is.Not.Null);
        Assert.That(capturedTimeData!.ShowDisplayIntervalInSeconds, Is.EqualTo(20));
        Assert.That(capturedTimeData!.HideDisplayIntervalInSeconds, Is.EqualTo(40));
    }
}