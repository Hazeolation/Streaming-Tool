import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const { mockConnection, mockBuilder, hubConnectionBuilderSpy, MockHubConnectionBuilder } =
  vi.hoisted(() => {
    const hubConnectionBuilderSpy = vi.fn();
    const mockConnection = {
      on: vi.fn(),
      onreconnecting: vi.fn(),
      onreconnected: vi.fn(),
      onclose: vi.fn(),
      start: vi.fn().mockResolvedValue(undefined),
    };

    const mockBuilder = {
      withUrl: vi.fn().mockReturnThis(),
      withAutomaticReconnect: vi.fn().mockReturnThis(),
      build: vi.fn(() => mockConnection),
    };

    class MockHubConnectionBuilder {
      constructor() {
        hubConnectionBuilderSpy();
        return mockBuilder;
      }
    }

    return { mockConnection, mockBuilder, hubConnectionBuilderSpy, MockHubConnectionBuilder };
  });

vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: MockHubConnectionBuilder,
}));

describe('Signalr', () => {
  let service: any;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    TestBed.resetTestingModule();

    vi.doMock('@microsoft/signalr', () => {
      class HubConnectionBuilder {
        constructor() {
          hubConnectionBuilderSpy();
          return mockBuilder;
        }
      }

      return { HubConnectionBuilder };
    });

    const { Signalr } = await import('./signalr');

    TestBed.configureTestingModule({
      providers: [Signalr],
    });
    service = TestBed.inject(Signalr);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose a start method', () => {
    expect(typeof service.start).toBe('function');
  });

  it('should have live state signal initialized to null', () => {
    expect(service.liveState).toBeDefined();
    expect(service.liveState()).toBeNull();
  });

  it('should have isConnected signal initialized to false', () => {
    expect(service.isConnected).toBeDefined();
    expect(service.isConnected()).toBe(false);
  });

  it('should have a tryConnect method', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(typeof (service as any).tryConnect).toBe('function');
  });

  it('should build a SignalR connection', async () => {
    await service.start();

    expect(mockBuilder.withUrl).toHaveBeenCalledWith('http://localhost:7000/overlayHub');

    expect(mockBuilder.withAutomaticReconnect).toHaveBeenCalled();
    expect(mockBuilder.build).toHaveBeenCalled();

    expect(mockConnection.on).toHaveBeenCalledWith('broadcastStateUpdated', expect.any(Function));

    expect(mockConnection.onreconnecting).toHaveBeenCalled();
    expect(mockConnection.onreconnected).toHaveBeenCalled();
    expect(mockConnection.onclose).toHaveBeenCalled();

    expect(mockConnection.start).toHaveBeenCalled();
    expect(service.isConnected()).toBe(true);
  });

  it('should retry connection after 5 seconds when start fails', async () => {
    vi.useFakeTimers();

    mockConnection.start
      .mockRejectedValueOnce(new Error('Connection failed'))
      .mockResolvedValueOnce(undefined);

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await service.start();

    expect(mockConnection.start).toHaveBeenCalledOnce();
    expect(service.isConnected()).toBe(false);

    await vi.advanceTimersByTimeAsync(5000);

    expect(mockConnection.start).toHaveBeenCalledTimes(2);
    expect(service.isConnected()).toBe(true);

    consoleErrorSpy.mockRestore();
    vi.useRealTimers();
  });
});
