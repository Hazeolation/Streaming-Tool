import { Injectable, signal, WritableSignal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BroadcastState } from '../models/broadcast-state';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  private connection?: signalR.HubConnection;

  liveState: WritableSignal<BroadcastState | null> = signal<BroadcastState | null>(null);
  isConnected: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * Starts the SignalR connection to the backend hub and sets up a listener for incoming broadcast state updates. When a new state is received from the 'broadcastStateUpdated' event, it updates the `liveState` signal with the new broadcast state. This allows components that depend on the `liveState` signal to reactively update their UI based on the latest broadcast state received from the backend.
   */
  async start() {
    this.connection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:7000/overlayHub')
    .withAutomaticReconnect()
    .build();

    this.connection.on('broadcastStateUpdated', (state: BroadcastState) => {
      this.liveState.set(state);
    });

    this.connection.onreconnecting(() => this.isConnected.set(false));
    this.connection.onreconnected(() => this.isConnected.set(true));
    this.connection.onclose(() => this.isConnected.set(false));

    await this.tryConnect();
  }

  private async tryConnect(): Promise<void> {
    try {
      await this.connection!.start();
      this.isConnected.set(true);
      console.log('SignalR connected');
    } catch {
      this.isConnected.set(false);
      console.error('SignalR connection failed, retrying in 5s...');
      setTimeout(() => this.tryConnect(), 5000);
    }
  }
}
