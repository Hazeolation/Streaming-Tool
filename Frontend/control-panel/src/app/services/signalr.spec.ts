import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

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

describe('Signalr', () => {
  let service: InstanceType<typeof import('./signalr').Signalr>;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    TestBed.resetTestingModule();

    vi.doMock('@microsoft/signalr', () => {
      class HubConnectionBuilder {
        withUrl = mockBuilder.withUrl;
        withAutomaticReconnect = mockBuilder.withAutomaticReconnect;
        build = mockBuilder.build;
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
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('should build a SignalR connection', async () => {
    await service.start();

    await vi.waitFor(() => {
      expect(mockBuilder.withUrl).toHaveBeenCalledWith('http://localhost:7000/overlayHub');
    });

    expect(mockBuilder.withAutomaticReconnect).toHaveBeenCalled();
    expect(mockBuilder.build).toHaveBeenCalled();

    expect(mockConnection.on).toHaveBeenCalledWith('broadcastStateUpdated', expect.any(Function));

    expect(mockConnection.start).toHaveBeenCalled();
    expect(service.isConnected()).toBe(true);
  });

  it('should retry connection after 5 seconds when start fails', async () => {
    vi.useFakeTimers();

    mockConnection.start
      .mockRejectedValueOnce(new Error('Connection failed'))
      .mockResolvedValueOnce(undefined);

    vi.spyOn(console, 'error').mockImplementation(() => {});

    await service.start();

    await vi.waitFor(() => {
      expect(mockConnection.start).toHaveBeenCalledTimes(1);
    });

    await vi.advanceTimersByTimeAsync(5000);

    await vi.waitFor(() => {
      expect(mockConnection.start).toHaveBeenCalledTimes(2);
    });

    expect(service.isConnected()).toBe(true);

    vi.useRealTimers();
  });
});
