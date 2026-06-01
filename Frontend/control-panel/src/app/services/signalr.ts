import { Injectable, signal, WritableSignal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BroadcastState } from '../models/broadcast-state';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  private connection?: signalR.HubConnection;

  liveState: WritableSignal<BroadcastState | null> = signal<BroadcastState | null>(null);

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

    await this.connection.start();

    console.log('SignalR connected');
  }
}
