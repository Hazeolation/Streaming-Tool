import { TestBed } from '@angular/core/testing';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';

const mockConnection = {
  start: vi.fn().mockResolvedValue(undefined),
  on: vi.fn(),
  onreconnecting: vi.fn(),
  onreconnected: vi.fn(),
  onclose: vi.fn(),
};

const mockBuilder = {
  withUrl: vi.fn().mockReturnThis(),
  withAutomaticReconnect: vi.fn().mockReturnThis(),
  build: vi.fn().mockReturnValue(mockConnection),
};

vi.mock('@microsoft/signalr', () => {
  return {
    HubConnectionBuilder: vi.fn(function () {
      return mockBuilder;
    }),
  };
});
import * as signalR from '@microsoft/signalr';
import { Signalr } from './signalr';

describe('Signalr', () => {
  let service: Signalr;

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.configureTestingModule({});
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

    expect(signalR.HubConnectionBuilder).toHaveBeenCalled();

    expect(mockBuilder.withUrl).toHaveBeenCalledWith(
      'http://localhost:7000/overlayHub'
    );

    expect(mockBuilder.withAutomaticReconnect).toHaveBeenCalled();
    expect(mockBuilder.build).toHaveBeenCalled();

    expect(mockConnection.on).toHaveBeenCalledWith(
      'broadcastStateUpdated',
      expect.any(Function)
    );

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

    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await service.start();

    expect(mockConnection.start).toHaveBeenCalledTimes(1);
    expect(service.isConnected()).toBe(false);

    await vi.advanceTimersByTimeAsync(5000);

    expect(mockConnection.start).toHaveBeenCalledTimes(2);
    expect(service.isConnected()).toBe(true);

    consoleErrorSpy.mockRestore();
    vi.useRealTimers();
  });
});