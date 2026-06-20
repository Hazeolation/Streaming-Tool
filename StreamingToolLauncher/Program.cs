using System.Diagnostics;
using Microsoft.VisualBasic;

Console.OutputEncoding = System.Text.Encoding.UTF8;

Console.WriteLine("Streaming Tool wird gestartet...");
Console.WriteLine("Suche nach Abhängigkeiten...");

if (!CommandExists("node"))
{
    Console.WriteLine("Node.js ist nicht installiert.");
    Console.WriteLine("Soll Node.js jetzt installiert werden? (j/N)");
    Console.Write("> ");
    char response = Console.ReadKey().KeyChar;
    Console.WriteLine();
    if (char.ToLower(response) == 'y')
    {
        Console.WriteLine("Versuche Node.js mittels WinGet zu installieren...");
        bool installed = InstallNode();
        if (installed) Console.WriteLine("Node.js wurde erfolgreich installiert.");
        else
        {
            Console.WriteLine("Node.js konnte nicht installiert werden. Bitte hier installieren: https://nodejs.org/en/download");
            Pause();
            return;
        }

        if (!CommandExists("node"))
        {
            Console.WriteLine("Node.js wurde installiert, kann aber nicht gefunden werden.");
            Pause();
            return;
        }
    }
}

if (!DotNet9Exists())
{
    Console.WriteLine(".NET 9 ist nicht installiert.");
    Console.WriteLine("Soll .NET 9 jetzt installiert werden? (j/N)");
    Console.Write("> ");
    char response = Console.ReadKey().KeyChar;
    Console.WriteLine();

    if (char.ToLower(response) == 'y')
    {
        Console.WriteLine("Versuche .NET 9 mittels WinGet zu installieren...");
        bool installed = InstallDotNet();
        if (installed) Console.WriteLine(".NET 9 wurde erfolgreich installiert.");
        else
        {
            Console.WriteLine(".NET 9 konnte nicht installiert werden. Bitte hier installieren: https://dotnet.microsoft.com/de-de/download/dotnet/9.0");
            Pause();
            return;
        }

        if (!DotNet9Exists())
        {
            Console.WriteLine(".NET 9 wurde installiert, kann aber nicht gefunden werden.");
            Pause();
            return;
        }
    }
}

string root = AppContext.BaseDirectory;

string frontend = Path.Combine(root, "Frontend", "control-panel");
string backend = Path.Combine(root, "Backend", "DSB.StreamBackend");

if (!File.Exists(Path.Combine(frontend, "package.json")))
{
    Console.WriteLine("Frontend wurde nicht gefunden!");
    Pause();
    return;
}

if (!File.Exists(Path.Combine(backend, "DSB.StreamBackend.csproj")))
{
    Console.WriteLine("Backend wurde nicht gefunden!");
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
Console.WriteLine("Streaming Tool gestartet. Dieses Programm kann nun beendet werden.\nDrücken Sie eine beliebige Taste zum Schließen...");
Console.ReadKey();

/// <summary>
/// Checks whether a specified command exists on the system
/// </summary>
/// <param name="command">The command to check for</param>
/// <returns>True if the command is found, otherwise false</returns>
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

/// <summary>
/// Checks whether .NET 9 is installed on the system
/// </summary>
/// <returns>True if .NET 9 is found, otherwise false</returns>
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

/// <summary>
/// Starts a new cmd process
/// </summary>
/// <param name="title">The window title</param>
/// <param name="workingDir">The directory to start the cmd process from</param>
/// <param name="command">The command to run</param>
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

/// <summary>
/// Attempts to install Node.js via WinGet
/// </summary>
/// <returns>True if Node.js was installed successfully, otherwise false</returns>
static bool InstallNode()
{
    Process? p = Process.Start(new ProcessStartInfo
    {
        FileName = "cmd.exe",
        Arguments = "/c winget install -e --id OpenJS.NodeJS",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    });

    if (p is null) return false;

    string output = p.StandardOutput.ReadToEnd();
    string error = p.StandardError.ReadToEnd();
    p.WaitForExit();

    if (p.ExitCode == 0) return true;

    Console.WriteLine("Fehler bei der Installation:");
    if (!string.IsNullOrWhiteSpace(output)) Console.WriteLine(output.Trim());
    if (!string.IsNullOrWhiteSpace(error)) Console.WriteLine(error.Trim());

    return false;
}

/// <summary>
/// Attempts to install .NET 9 via WinGet
/// </summary>
/// <returns>True if .NET 9 was installed successfully, otherwise false</returns>
static bool InstallDotNet()
{
    Process? p = Process.Start(new ProcessStartInfo
    {
        FileName = "cmd.exe",
        Arguments = "/c winget install -e --id Microsoft.DotNet.SDK.9",
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        UseShellExecute = false,
        CreateNoWindow = true
    });

    if (p is null) return false;

    string output = p.StandardOutput.ReadToEnd();
    string error = p.StandardError.ReadToEnd();
    p.WaitForExit();

    if (p.ExitCode == 0) return true;

    Console.WriteLine("Fehler bei der Installation:");
    if (!string.IsNullOrWhiteSpace(output)) Console.WriteLine(output.Trim());
    if (!string.IsNullOrWhiteSpace(error)) Console.WriteLine(error.Trim());

    return false;
}

/// <summary>
/// Pauses the program
/// </summary>
static void Pause()
{
    Console.WriteLine("Drücken Sie eine beliebige Taste...");
    Console.ReadKey();
}