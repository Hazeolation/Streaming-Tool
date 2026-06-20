using System.Diagnostics;

Console.OutputEncoding = System.Text.Encoding.UTF8;

Console.WriteLine("Streaming Tool wird gestartet...");
Console.WriteLine("Suche nach Abhängigkeiten...");

if (!CommandExists("node"))
{
    Console.WriteLine("Node.js ist nicht installiert.");
    Console.WriteLine("Bitte installieren: https://nodejs.org");
    Pause();
    return;
}

if (!DotNet9Exists())
{
    Console.WriteLine(".NET 9 SDK ist nicht installiert.");
    Console.WriteLine("Bitte installieren: https://dotnet.microsoft.com/download/dotnet/9.0");
    Pause();
    return;
}

var root = AppContext.BaseDirectory;

var frontend = Path.Combine(root, "Frontend", "control-panel");
var backend = Path.Combine(root, "Backend", "DSB.StreamBackend");

if (!File.Exists(Path.Combine(frontend, "package.json")))
{
    Console.WriteLine("Frontend project not found!");
    Pause();
    return;
}

if (!File.Exists(Path.Combine(backend, "DSB.StreamBackend.csproj")))
{
    Console.WriteLine("Backend project not found!");
    Pause();
    return;
}

StartCmd("Streaming Tool Frontend", frontend, "npm i && npm start");
StartCmd("Streaming Tool Backend", backend, "dotnet run");

Process.Start(new ProcessStartInfo
{
    FileName = "http://localhost:4200",
    UseShellExecute = true
});

Console.WriteLine("Webseite wurde im Browser geöffnet.");
Console.WriteLine("Streaming Tool gestartet. Drücken Sie eine beliebige Taste zum Schließen...");
Console.ReadKey();

static bool CommandExists(string command)
{
    var p = Process.Start(new ProcessStartInfo
    {
        FileName = "cmd.exe",
        Arguments = $"/c where {command}",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    });

    p!.WaitForExit();
    return p.ExitCode == 0;
}

static bool DotNet9Exists()
{
    if (!CommandExists("dotnet"))
        return false;

    var p = Process.Start(new ProcessStartInfo
    {
        FileName = "cmd.exe",
        Arguments = "/c dotnet --list-sdks",
        RedirectStandardOutput = true,
        UseShellExecute = false,
        CreateNoWindow = true
    });

    var output = p!.StandardOutput.ReadToEnd();
    p.WaitForExit();

    return output.Split('\n').Any(x => x.TrimStart().StartsWith("9."));
}

static void StartCmd(string title, string workingDir, string command)
{
    Process.Start(new ProcessStartInfo
    {
        FileName = "cmd.exe",
        Arguments = $"/k title {title} && {command}",
        WorkingDirectory = workingDir,
        UseShellExecute = true,
        WindowStyle = ProcessWindowStyle.Minimized
    });
}

static void Pause()
{
    Console.WriteLine("Drücken Sie eine beliebige Taste...");
    Console.ReadKey();
}