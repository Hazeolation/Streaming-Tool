import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LogService } from './log';
import { LogLevel } from '../enums/log-level';

describe('LogService', () => {
  let service: LogService;

  beforeEach(() => {
    service = new LogService();

    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a log entry with Info level', () => {
    service.info('test message', { a: 1 });

    expect(console.log).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [prefix, message, entry] = (console.log as any).mock.calls[0];

    expect(prefix).toBe('[Info]');
    expect(message).toBe('test message');

    expect(entry).toMatchObject({
      level: LogLevel.Info,
      message: 'test message',
      data: { a: 1 },
      scope: undefined,
    });
  });

  it('should route Warning logs to console.warn', () => {
    service.warn('warn message');

    expect(console.warn).toHaveBeenCalledTimes(1);

    const [prefix] = (console.warn as any).mock.calls[0];
    expect(prefix).toBe('[Warning]');
  });

  it('should route Error logs to console.error', () => {
    service.error('error message', new Error('fail'));

    expect(console.error).toHaveBeenCalledTimes(1);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [prefix, message, entry] = (console.error as any).mock.calls[0];

    expect(prefix).toBe('[Error]');
    expect(message).toBe('error message');

    expect(entry.error).toBeInstanceOf(Error);
  });

  it('should attach scope from beginScope', () => {
    const scope = service.beginScope('TestScope');

    service.info('inside scope');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, , entry] = (console.log as any).mock.calls[0];

    expect(entry.scope).toBe('TestScope');

    scope.dispose();

    service.info('outside scope');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, , entry2] = (console.log as any).mock.calls[1];

    expect(entry2.scope).toBeUndefined();
  });

  it('should support nested scopes (LIFO behavior)', () => {
    const scope1 = service.beginScope('Scope1');
    const scope2 = service.beginScope('Scope2');

    service.info('test');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, , entry] = (console.log as any).mock.calls[0];

    expect(entry.scope).toBe('Scope2');

    scope2.dispose();

    service.info('after pop');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, , entry2] = (console.log as any).mock.calls[1];

    expect(entry2.scope).toBe('Scope1');

    scope1.dispose();
  });

  it('should include timestamp in ISO format', () => {
    service.info('time test');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, , entry] = (console.log as any).mock.calls[0];

    expect(entry.timestamp).toBe('2025-01-01T00:00:00.000Z');
  });

  it('should pass error correctly in critical logs', () => {
    const err = new Error('critical fail');

    service.critical('critical issue', err, { x: 1 });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [, , entry] = (console.error as any).mock.calls[0];

    expect(entry.level).toBe(LogLevel.Critical);
    expect(entry.error).toBe(err);
    expect(entry.data).toEqual({ x: 1 });
  });
});
