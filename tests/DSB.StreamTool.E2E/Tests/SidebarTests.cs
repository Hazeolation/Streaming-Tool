using System.Text.RegularExpressions;
using Microsoft.Playwright.NUnit;

namespace DSB.StreamTool.E2E.Tests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public class SidebarTests : PageTest
{
    private const string BaseUrl = "http://localhost:4200";

    [SetUp]
    public async Task NavigateToDashboard()
    {
        await Page.GotoAsync(BaseUrl);
        await Expect(Page.Locator(".sidebar")).ToBeVisibleAsync();
    }

    [Test]
    public async Task Sidebar_Division_SelectIsVisible()
    {
        var divisionSelect = Page.Locator(".sidebar section:has(h2:text('Division')) select");
        await Expect(divisionSelect).ToBeVisibleAsync();
    }

    [Test]
    public async Task Sidebar_Division_SelectHasOptions()
    {
        var options = Page.Locator(".sidebar section:has(h2:text('Division')) select option");
        var count = await options.CountAsync();
        Assert.That(count, Is.GreaterThan(0), "Division select should have at least one option.");
    }

    [Test]
    public async Task Sidebar_Teams_BothInputsAreVisible()
    {
        var teamInputs = Page.Locator(".sidebar section:has(h2:text('Teams')) input");
        await Expect(teamInputs.First).ToBeVisibleAsync();
        await Expect(teamInputs.Nth(1)).ToBeVisibleAsync();
    }

    [Test]
    public async Task Sidebar_TeamAlphaName_UpdatesTopbar()
    {
        var alphaInput = Page.Locator(".sidebar section:has(h2:text('Teams')) input").First;
        await alphaInput.ClearAsync();
        await alphaInput.FillAsync("AlphaE2E");

        await Expect(Page.Locator(".topbar .score")).ToContainTextAsync("AlphaE2E");
    }

    [Test]
    public async Task Sidebar_TeamBravoName_UpdatesTopbar()
    {
        var bravoInput = Page.Locator(".sidebar section:has(h2:text('Teams')) input").Nth(1);
        await bravoInput.ClearAsync();
        await bravoInput.FillAsync("BravoE2E");

        await Expect(Page.Locator(".topbar .score")).ToContainTextAsync("BravoE2E");
    }

    [Test]
    public async Task Sidebar_TeamAlphaName_RespectsMaxLength()
    {
        var alphaInput = Page.Locator(".sidebar section:has(h2:text('Teams')) input").First;
        // maxLength is 30 characters
        await alphaInput.ClearAsync();
        await alphaInput.FillAsync("WayTooLongTeamNameHereSeriously");

        var value = await alphaInput.InputValueAsync();
        Assert.That(value.Length, Is.LessThanOrEqualTo(30), "Team name should be capped at 30 characters.");
    }

    [Test]
    public async Task Sidebar_AlphaIsLeft_CheckboxIsVisible()
    {
        var checkbox = Page.Locator(".sidebar .swap-sides input[type='checkbox']");
        await Expect(checkbox).ToBeVisibleAsync();
    }

    [Test]
    public async Task Sidebar_Streamer_InputAcceptsText()
    {
        var streamerInput = Page.Locator("input[placeholder='@streamer']");
        await streamerInput.ClearAsync();
        await streamerInput.FillAsync("TestStreamer");

        await Expect(streamerInput).ToHaveValueAsync("TestStreamer");
    }

    [Test]
    public async Task Sidebar_Commentator1_InputAcceptsText()
    {
        var caster1 = Page.Locator("input[placeholder='@caster1']");
        await caster1.ClearAsync();
        await caster1.FillAsync("CasterOne");

        await Expect(caster1).ToHaveValueAsync("CasterOne");
    }

    [Test]
    public async Task Sidebar_Commentator2_InputAcceptsText()
    {
        var caster2 = Page.Locator("input[placeholder='@caster2']");
        await caster2.ClearAsync();
        await caster2.FillAsync("CasterTwo");

        await Expect(caster2).ToHaveValueAsync("CasterTwo");
    }

    [Test]
    public async Task Sidebar_Visibility_AllThreeButtonsPresent()
    {
        await Expect(Page.Locator("button:text('Kartenanzeige')")).ToBeVisibleAsync();
        await Expect(Page.Locator("button:text('Spielstand')")).ToBeVisibleAsync();
        await Expect(Page.Locator("button:text('Kommentatoren')")).ToBeVisibleAsync();
    }

    [Test]
    public async Task Sidebar_Visibility_MapScreenButton_TogglesActiveClass()
    {
        var btn = Page.Locator("button:text('Kartenanzeige')");
        var wasActive = await btn.EvaluateAsync<bool>("el => el.classList.contains('toggled')");

        await btn.ClickAsync();

        if (wasActive)
            await Expect(btn).Not.ToHaveClassAsync(new Regex(@"\btoggled\b"));
        else
            await Expect(btn).ToHaveClassAsync(new Regex(@"\btoggled\b"));
    }

    [Test]
    public async Task Sidebar_Visibility_ScoreBoxButton_TogglesActiveClass()
    {
        var btn = Page.Locator("button:text('Spielstand')");
        var wasActive = await btn.EvaluateAsync<bool>("el => el.classList.contains('toggled')");

        await btn.ClickAsync();

        if (wasActive)
            await Expect(btn).Not.ToHaveClassAsync(new Regex(@"\btoggled\b"));
        else
            await Expect(btn).ToHaveClassAsync(new Regex(@"\btoggled\b"));
    }

    [Test]
    public async Task Sidebar_Visibility_CommentatorButton_TogglesActiveClass()
    {
        var btn = Page.Locator("button:text('Kommentatoren')");
        var wasActive = await btn.EvaluateAsync<bool>("el => el.classList.contains('toggled')");

        await btn.ClickAsync();

        if (wasActive)
            await Expect(btn).Not.ToHaveClassAsync(new Regex(@"\btoggled\b"));
        else
            await Expect(btn).ToHaveClassAsync(new Regex(@"\btoggled\b"));
    }

    [Test]
    public async Task Sidebar_CommBoxSettings_ManualMode_ElementsPresent()
    {
        await Page.GotoAsync(BaseUrl);

        var timeDataDetails = Page.Locator(".comm-box-time-data__details-container");
        await timeDataDetails.ClickAsync();

        var manualModeButton = Page.Locator(".manual-display-mode-button");
        await manualModeButton.ClickAsync();

        await Expect(Page.Locator(".click-button.hide-comm-box-button")).ToBeVisibleAsync();
        await Expect(Page.Locator(".click-button.show-comm-box-button")).ToBeVisibleAsync();
        await Expect(Page.Locator(".click-button.show-comm-box-temp-button")).ToBeVisibleAsync();

        await Expect(Page.Locator(".show-temp-comm-box-interval-input")).ToBeVisibleAsync();
    }

    [Test]
    public async Task Sidebar_CommBoxSettings_AutoMode_ElementsPresent()
    {
        await Page.GotoAsync(BaseUrl);

        var timeDataDetails = Page.Locator(".comm-box-time-data__details-container");
        await timeDataDetails.ClickAsync();

        var autoModeButton = Page.Locator(".auto-display-mode-button");
        await autoModeButton.ClickAsync();

        await Expect(Page.Locator(".hide-comm-box-interval-input")).ToBeVisibleAsync();
        await Expect(Page.Locator(".show-comm-box-interval-input")).ToBeVisibleAsync();
    }
}
