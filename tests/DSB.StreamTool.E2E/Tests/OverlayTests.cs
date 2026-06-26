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

    [Test]
    public async Task ScoreBox_CommBoxPeriodicDisplaying_BlendInOut()
    {
        await Page.GotoAsync(BaseUrl);

        var timeDataDetails = Page.Locator(".comm-box-time-data__details-container");
        await timeDataDetails.ClickAsync();

        var showInput = Page.Locator(".show-comm-box-interval-input");
        var hideInput = Page.Locator(".hide-comm-box-interval-input");

        await showInput.FillAsync("2");
        await Expect(showInput).ToHaveValueAsync("2");

        await hideInput.FillAsync("4");
        await Expect(hideInput).ToHaveValueAsync("4");

        var scoreBoxPage = await Page.Context.NewPageAsync();
        await scoreBoxPage.GotoAsync($"{BaseUrl}/overlay/score-box");

        await Expect(scoreBoxPage.Locator("app-commentator-box")).ToHaveClassAsync(new Regex(@"\binterval-hidden\b"));

        await Task.Delay(3000);
        await Expect(scoreBoxPage.Locator("app-commentator-box")).Not.ToHaveClassAsync(new Regex(@"\binterval-hidden\b"));

        await Task.Delay(2000);
        await Expect(scoreBoxPage.Locator("app-commentator-box")).ToHaveClassAsync(new Regex(@"\binterval-hidden\b"));

        await scoreBoxPage.CloseAsync();
    }

    [Test]
    public async Task ScoreBox_CommBoxPeriodicDisplay_VisibleWhenInputZero()
    {
        await Page.GotoAsync(BaseUrl);

        var timeDataDetails = Page.Locator(".comm-box-time-data__details-container");
        await timeDataDetails.ClickAsync();

        var showInput = Page.Locator(".show-comm-box-interval-input");
        var hideInput = Page.Locator(".hide-comm-box-interval-input");

        await showInput.FillAsync("0");
        await Expect(showInput).ToHaveValueAsync("0");

        await hideInput.FillAsync("2");
        await Expect(hideInput).ToHaveValueAsync("2");

        var scoreBoxPage = await Page.Context.NewPageAsync();
        await scoreBoxPage.GotoAsync($"{BaseUrl}/overlay/score-box");

        await Expect(scoreBoxPage.Locator("app-commentator-box")).Not.ToHaveClassAsync(new Regex(@"\binterval-hidden\b"));

        await Task.Delay(3000);
        await Expect(scoreBoxPage.Locator("app-commentator-box")).Not.ToHaveClassAsync(new Regex(@"\binterval-hidden\b"));

        await scoreBoxPage.CloseAsync();
    }

    public async Task EndScreen_Socials_SocialsContentVisible()
    {
        await Page.GotoAsync(BaseUrl);

        var timeDataDetails = Page.Locator(".socials__details-container");
        await timeDataDetails.ClickAsync();

        var twitterInput = Page.Locator(".twitter-handle-input");
        var discordInput = Page.Locator(".discord-invite-input");

        await twitterInput.FillAsync("@E2ETestDSB");
        await Expect(twitterInput).ToHaveValueAsync("@E2ETestDSB");

        await discordInput.FillAsync("e2eDiscordInv");
        await Expect(discordInput).ToHaveValueAsync("e2eDiscordInv");

        var endScreenPage = await Page.Context.NewPageAsync();
        await endScreenPage.GotoAsync($"{BaseUrl}/overlay/end-screen");

        await Expect(endScreenPage.Locator(".socials-text.twitter-handle")).Not.ToHaveClassAsync(new Regex(@"\bhide-social\b"));
        await Expect(endScreenPage.Locator(".socials-text.twitter-handle")).ToContainTextAsync("@E2ETestDSB");

        await Expect(endScreenPage.Locator(".socials-text.discord-handle")).Not.ToHaveClassAsync(new Regex(@"\bhide-social\b"));
        await Expect(endScreenPage.Locator(".socials-text.discord-invite")).ToContainTextAsync("discord.gg/e2eDiscordInv");

        await endScreenPage.CloseAsync();
    }

    public async Task EndScreen_Socials_SocialsInvisibleOnEmptyInput()
    {
        await Page.GotoAsync(BaseUrl);

        var timeDataDetails = Page.Locator(".socials__details-container");
        await timeDataDetails.ClickAsync();

        var twitterInput = Page.Locator(".twitter-handle-input");
        var discordInput = Page.Locator(".discord-invite-input");

        await twitterInput.FillAsync(string.Empty);
        await Expect(twitterInput).ToHaveValueAsync(string.Empty);

        await discordInput.FillAsync(string.Empty);
        await Expect(discordInput).ToHaveValueAsync(string.Empty);

        var endScreenPage = await Page.Context.NewPageAsync();
        await endScreenPage.GotoAsync($"{BaseUrl}/overlay/end-screen");

        await Expect(endScreenPage.Locator(".socials-text.twitter-handle")).ToHaveClassAsync(new Regex(@"\bhide-social\b"));
        await Expect(endScreenPage.Locator(".socials-text.discord-invite")).ToHaveClassAsync(new Regex(@"\bhide-social\b"));

        await endScreenPage.CloseAsync();
    }

    [GeneratedRegex(@"^Season [0-9]?[0-9] - Woche \d - Division [1-8]")]
    private static partial Regex SeasonWeekDivisionRegex();
}
