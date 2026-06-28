namespace DSB.StreamBackend.Logging;

/// <summary>
/// Provides centralized application logging functionality.
/// </summary>
public interface ILogService
{
    /// <summary>
    /// Writes a trace message.
    /// </summary>
    void Trace(string message, object? data = null);

    /// <summary>
    /// Writes a debug message.
    /// </summary>
    void Debug(string message, object? data = null);

    /// <summary>
    /// Writes an informational message.
    /// </summary>
    void Info(string message, object? data = null);

    /// <summary>
    /// Writes a warning message.
    /// </summary>
    void Warning(string message, object? data = null);

    /// <summary>
    /// Writes an error message.
    /// </summary>
    void Error(string message, Exception? ex = null, object? data = null);

    /// <summary>
    /// Writes a critical failure message.
    /// </summary>
    void Critical(string message, Exception? ex = null, object? data = null);

    /// <summary>
    /// Begins a logical logging scope.
    /// </summary>
    IDisposable BeginScope(string scopeName);
}