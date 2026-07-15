import { TestBed } from '@angular/core/testing';
import * as signalR from '@microsoft/signalr';
import { SignalrEvents } from './signalr-events';

describe('SignalrEvents', () => {
  let service: SignalrEvents;

  const mockConnection = {
    on: vi.fn(),
    onreconnecting: vi.fn(),
    onreconnected: vi.fn(),
    onclose: vi.fn(),
    start: vi.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    TestBed.resetTestingModule();

    vi.spyOn(signalR.HubConnectionBuilder.prototype, 'withUrl').mockReturnThis();

    vi.spyOn(signalR.HubConnectionBuilder.prototype, 'withAutomaticReconnect').mockReturnThis();

    vi.spyOn(signalR.HubConnectionBuilder.prototype, 'build').mockReturnValue(
      mockConnection as never,
    );

    TestBed.configureTestingModule({
      providers: [SignalrEvents],
    });

    service = TestBed.inject(SignalrEvents);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be connected to signalr eventhub on component create', () => {
    expect(service.isConnected).toBeDefined();
    expect(service.isConnected()).toBe(true);
  });

  it('should build a SignalR connection', async () => {
    expect(signalR.HubConnectionBuilder.prototype.withUrl).toHaveBeenCalledWith(
      'http://localhost:7000/eventHub',
    );

    expect(signalR.HubConnectionBuilder.prototype.withAutomaticReconnect).toHaveBeenCalled();

    expect(signalR.HubConnectionBuilder.prototype.build).toHaveBeenCalled();

    expect(mockConnection.onreconnecting).toHaveBeenCalled();
    expect(mockConnection.onreconnected).toHaveBeenCalled();
    expect(mockConnection.onclose).toHaveBeenCalled();

    expect(mockConnection.start).toHaveBeenCalled();
    expect(service.isConnected()).toBe(true);
  });
});
