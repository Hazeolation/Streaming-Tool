using System.Text.RegularExpressions;
using Microsoft.Playwright.NUnit;

namespace DSB.StreamTool.E2E.Tests;

[Parallelizable(ParallelScope.Self)]
[TestFixture]
public partial class OverlayTests : PageTest
{
    private const string BaseUrl = "http://localhost:4200";

    // --- Score Box ---

    [Test]
    public async Task ScoreBox_PageLoads()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/score-box");
        await Expect(Page.Locator(".score-box")).ToBeAttachedAsync();
    }

    [Test]
    public async Task ScoreBox_ShowsTeamNameElements()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/score-box");
        await Expect(Page.Locator(".score-box .team.left")).ToBeAttachedAsync();
        await Expect(Page.Locator(".score-box .team.right")).ToBeAttachedAsync();
    }

    [Test]
    public async Task ScoreBox_ShowsScoreElement()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/score-box");
        await Expect(Page.Locator(".score-box .score")).ToBeAttachedAsync();
    }

    [Test]
    public async Task ScoreBox_Score_ContainsSeparator()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/score-box");
        await Expect(Page.Locator(".score-box .score .separator")).ToContainTextAsync(":");
    }

    // --- Commentator Box ---

    [Test]
    public async Task CommentatorBox_PageLoads()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/commentator-box");
        await Expect(Page.Locator(".commentator-box")).ToBeAttachedAsync();
    }

    [Test]
    public async Task CommentatorBox_ShowsStreamerElement()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/commentator-box");
        await Expect(Page.Locator(".commentator-box .streamer-text")).ToBeAttachedAsync();
    }

    [Test]
    public async Task CommentatorBox_ShowsCastersElement()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/commentator-box");
        await Expect(Page.Locator(".commentator-box .casters-text")).ToBeAttachedAsync();
    }

    [Test]
    public async Task CommentatorBox_StreamerText_ContainsLabel()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/commentator-box");
        await Expect(Page.Locator(".commentator-box .streamer-text")).ToContainTextAsync("Streamer:");
    }

    [Test]
    public async Task CommentatorBox_CastersText_ContainsLabel()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/commentator-box");
        await Expect(Page.Locator(".commentator-box .casters-text")).ToContainTextAsync("Kommentatoren:");
    }

    // --- Infobox ---

    [Test]
    public async Task Infobox_PageLoads()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/info-box");
        await Expect(Page.Locator(".infobox")).ToBeAttachedAsync();
    }

    [Test]
    public async Task Infobox_ShowsLeagueText()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/info-box");
        await Expect(Page.Locator(".infobox .tourney-name")).ToContainTextAsync(SeasonWeekDivisionRegex());
    }

    [Test]
    public async Task Infobox_ShowsVersusContainer()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/info-box");
        await Expect(Page.Locator(".infobox .versus")).ToBeAttachedAsync();
    }

    [Test]
    public async Task Infobox_Versus_ContainsVsLabel()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/info-box");
        await Expect(Page.Locator(".infobox .versus")).ToContainTextAsync("VS");
    }

    [Test]
    public async Task Infobox_ShowsScoreElement()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/info-box");
        await Expect(Page.Locator(".infobox .score")).ToBeAttachedAsync();
    }

    // --- Map Screen ---

    [Test]
    public async Task MapScreen_PageLoads()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/map-screen");
        await Expect(Page.Locator(".map-screen")).ToBeAttachedAsync();
    }

    [Test]
    public async Task MapScreen_ShowsHeader()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/map-screen");
        await Expect(Page.Locator(".map-screen .header")).ToBeAttachedAsync();
    }

    [Test]
    public async Task MapScreen_Header_ShowsTeamNames()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/map-screen");
        await Expect(Page.Locator(".map-screen .team-alpha-name")).ToBeAttachedAsync();
        await Expect(Page.Locator(".map-screen .team-bravo-name")).ToBeAttachedAsync();
    }

    [Test]
    public async Task MapScreen_Header_ShowsMatchScore()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/map-screen");
        await Expect(Page.Locator(".map-screen .match-score")).ToBeAttachedAsync();
    }

    [Test]
    public async Task MapScreen_Header_ShowsSeasonDivisionText()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/map-screen");
        await Expect(Page.Locator(".map-screen .season-division-display")).ToBeAttachedAsync();
    }

    [Test]
    public async Task MapScreen_ShowsMapGrid()
    {
        await Page.GotoAsync($"{BaseUrl}/overlay/map-screen");
        await Expect(Page.Locator(".map-screen .map-grid")).ToBeAttachedAsync();
    }

    // --- Cross-Page: Visibility toggle ---

    [Test]
    public async Task ScoreBox_VisibilityToggle_TogglesOpacity()
    {
        // Navigate to dashboard and read current visibility state
        await Page.GotoAsync(BaseUrl);
        var btn = Page.Locator("button:text('Spielstand')");
        var isCurrentlyActive = await btn.EvaluateAsync<bool>("el => el.classList.contains('active')");

        // Open the overlay in a second tab
        var overlayPage = await Page.Context.NewPageAsync();
        await overlayPage.GotoAsync($"{BaseUrl}/overlay/score-box");

        // Toggle visibility and wait for Angular to update the DOM
        await btn.ClickAsync();
        if (isCurrentlyActive)
            await Expect(btn).Not.ToHaveClassAsync(new Regex(@"\bactive\b"));
        else
            await Expect(btn).ToHaveClassAsync(new Regex(@"\bactive\b"));

        // Restore original state
        await btn.ClickAsync();
        if (isCurrentlyActive)
            await Expect(btn).ToHaveClassAsync(new Regex(@"\bactive\b"));
        else
            await Expect(btn).Not.ToHaveClassAsync(new Regex(@"\bactive\b"));

        await overlayPage.CloseAsync();
    }

    [GeneratedRegex(@"^Season [0-9]?[0-9] - Woche \d - Division [1-8]")]
    private static partial Regex SeasonWeekDivisionRegex();
}
