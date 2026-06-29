using System.Text.Json;

namespace DSB.StreamBackend.Logging;

/// <summary>
/// Writes logs to the console using colors
/// based on severity.
/// </summary>
public class ConsoleLogSink : ILogSink
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        WriteIndented = false
    };

    /// <inheritdoc />
    public Task WriteAsync(LogEntry entry)
    {
        var originalColor = Console.ForegroundColor;

        Console.ForegroundColor = GetColor(entry.Level);

        Console.Write($"[{entry.Timestamp:HH:mm:ss}] ");

        Console.Write($"[{entry.Level}] ");

        if (!string.IsNullOrWhiteSpace(entry.Scope))
        {
            Console.ForegroundColor = ConsoleColor.DarkCyan;

            Console.Write($"[{entry.Scope}] ");

            Console.ForegroundColor = originalColor;
        }

        Console.ForegroundColor = originalColor;

        Console.Write(entry.Message);

        if (entry.Data is not null)
        {
            Console.ForegroundColor = ConsoleColor.Cyan;

            Console.Write(" | Data: ");

            Console.Write(JsonSerializer.Serialize(entry.Data, JsonOptions));

            Console.ForegroundColor = originalColor;
        }

        Console.WriteLine();

        if (entry.Exception is not null)
        {
            Console.ForegroundColor = ConsoleColor.Red;

            Console.WriteLine(entry.Exception);

            Console.ForegroundColor = originalColor;
        }

        return Task.CompletedTask;
    }

    /// <summary>
    /// Returns the console color for a log level.
    /// </summary>
    private static ConsoleColor GetColor(LogLevel level)
        => level switch
        {
            LogLevel.Trace => ConsoleColor.DarkGray,
            LogLevel.Debug => ConsoleColor.Gray,
            LogLevel.Info => ConsoleColor.Green,
            LogLevel.Warning => ConsoleColor.Yellow,
            LogLevel.Error => ConsoleColor.Red,
            LogLevel.Critical => ConsoleColor.Magenta,
            _ => ConsoleColor.White
        };
}