using DSB.StreamBackend.Logging;

namespace DSB.StreamBackend.Services;

/// <summary>
/// Default implementation of the logging service.
/// </summary>
/// <remarks>
/// Initializes a new logging service.
/// </remarks>
/// <param name="sinks">A list of all sinks to connect to the logging service.
public class LogService(IEnumerable<ILogSink> sinks) : ILogService
{
    /// <summary>
    /// Logs a Trace log.
    /// </summary>
    /// <remarks>
    /// Logs of this type will only be logged in the Development environment.
    /// </remarks>
    /// <param name="message">The log message to display</param>
    /// <param name="data">The object to log</param>
    public void Trace(string message, object? data = null)
        => Log(Logging.LogLevel.Trace, message, null, data);

    /// <summary>
    /// Logs a Debug log.
    /// </summary>
    /// <remarks>
    /// Logs of this type will only be logged in the Development environment.
    /// </remarks>
    /// <param name="message">The log message to display</param>
    /// <param name="data">The object to log</param>
    public void Debug(string message, object? data = null)
        => Log(Logging.LogLevel.Debug, message, null, data);

    /// <summary>
    /// Logs an Info log.
    /// </summary>
    /// <param name="message">The log message to display</param>
    /// <param name="data">The object to log</param>
    public void Info(string message, object? data = null)
        => Log(Logging.LogLevel.Info, message, null, data);

    /// <summary>
    /// Logs a Warning log.
    /// </summary>
    /// <param name="message">The log message to display</param>
    /// <param name="data">The object to log</param>
    public void Warning(string message, object? data = null)
        => Log(Logging.LogLevel.Warning, message, null, data);

    /// <summary>
    /// Logs an Error log.
    /// </summary>
    /// <param name="message">The log message to display</param>
    /// <param name="ex">The Exception to log</param>
    public void Error(string message, Exception? ex = null, object? data = null)
        => Log(Logging.LogLevel.Error, message, ex, data);

    /// <summary>
    /// Logs a Critical Error log.
    /// </summary>
    /// <param name="message">The log message to display</param>
    /// <param name="ex">The Exception to log</param>
    public void Critical(string message, Exception? ex = null, object? data = null)
        => Log(Logging.LogLevel.Critical, message, ex, data);

    /// <summary>
    /// Writes a log entry to all configured sinks.
    /// </summary>
    private void Log(Logging.LogLevel level, string message, Exception? ex, object? data)
    {
        var entry = new LogEntry
        {
            Timestamp = DateTime.UtcNow,
            Level = level,
            Message = message,
            Exception = ex,
            Data = data,
            Scope = LoggingScope.Current
        };

        foreach (var sink in sinks)
        {
            _ = sink.WriteAsync(entry);
        }
    }

    /// <inheritdoc />
    public IDisposable BeginScope(string scopeName)
    {
        return new LoggingScope(scopeName);
    }
}