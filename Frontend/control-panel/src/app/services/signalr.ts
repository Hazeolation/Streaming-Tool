import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BroadcastState } from '../models/broadcast-state';
import { Socials } from '../models/socials';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';
import { SignalrServiceConnection } from '../enums/SignalrServiceConnection';
import { LogService } from './log';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  private readonly log = inject(LogService);

  private connection?: signalR.HubConnection;

  /**
   * Connects the SignalR client to the broadcastStateUpdated stream
   */
  private connectToState = () => {
    this.connection?.on('broadcastStateUpdated', (state: BroadcastState) => {
      this.log.debug('SignalR broadcastStateUpdated received', state);

      this.liveState.set(state);
    });
  };

  /**
   * Connects the SignalR client to the socialsUpdated stream
   */
  private connectToSocials = () => {
    this.connection?.on('socialsUpdated', (socials: Socials) => {
      this.log.debug('SignalR socialsUpdated received', socials);

      this.liveSocials.set(socials);
    });
  };

  /**
   * Connects the SignalR client to the commentatorBoxTimeDataUpdated stream
   */
  private connectToCommentatorBoxTimeData = () => {
    this.connection?.on('commentatorBoxTimeDataUpdated', (timeData: CommentatorBoxTimeData) => {
      this.log.debug('SignalR commentatorBoxTimeDataUpdated received', timeData);

      this.liveCommentatorBoxTimeData.set(timeData);
    });
  };

  liveState: WritableSignal<BroadcastState | null> = signal<BroadcastState | null>(null);

  liveSocials: WritableSignal<Socials | null> = signal<Socials | null>(null);

  liveCommentatorBoxTimeData: WritableSignal<CommentatorBoxTimeData | null> =
    signal<CommentatorBoxTimeData | null>(null);

  isConnected: WritableSignal<boolean> = signal<boolean>(false);

  connectionType: SignalrServiceConnection = SignalrServiceConnection.None;

  private serviceConnections: Map<SignalrServiceConnection, () => void> = new Map([
    [SignalrServiceConnection.BroadcastState, this.connectToState],
    [SignalrServiceConnection.Socials, this.connectToSocials],
    [SignalrServiceConnection.CommentatorBoxTimeData, this.connectToCommentatorBoxTimeData],
  ]);

  /**
   * Starts SignalR connection
   */
  async start() {
    const scope = this.log.beginScope('Signalr.start');

    this.log.info('Initializing SignalR connection', {
      connectionType: this.connectionType,
    });

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:7000/overlayHub')
      .withAutomaticReconnect()
      .build();

    const connectionFunction = this.serviceConnections.get(this.connectionType);

    if (!connectionFunction) {
      this.log.warn('No SignalR connection handler registered', {
        connectionType: this.connectionType,
      });
    } else {
      this.log.debug('Registering SignalR handlers', {
        connectionType: this.connectionType,
      });

      connectionFunction();
    }

    this.connection.onreconnecting(() => {
      this.isConnected.set(false);
      this.log.warn('SignalR reconnecting...');
    });

    this.connection.onreconnected(() => {
      this.isConnected.set(true);
      this.log.info('SignalR reconnected');
    });

    this.connection.onclose(() => {
      this.isConnected.set(false);
      this.log.error('SignalR connection closed');
    });

    await this.tryConnect();

    scope.dispose();
  }

  /**
   * Connection retry logic
   */
  private async tryConnect(): Promise<void> {
    try {
      this.log.info('Starting SignalR connection attempt');

      await this.connection?.start();

      this.isConnected.set(true);

      this.log.info('SignalR connected successfully');
    } catch (err) {
      this.isConnected.set(false);

      this.log.error('SignalR connection failed, retrying...', err);

      setTimeout(() => this.tryConnect(), 5000);
    }
  }
}
