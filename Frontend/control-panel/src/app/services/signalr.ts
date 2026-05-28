import { Injectable, signal } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BroadcastState } from '../models/broadcast-state';

@Injectable({
  providedIn: 'root',
})
export class Signalr {
  private connection?: signalR.HubConnection;

  liveState = signal<BroadcastState | null>(null);

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
