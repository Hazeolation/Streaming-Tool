import { Component, inject, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { Signalr } from '../../services/signalr';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the topbar component to update its UI accordingly whenever the state changes. This setup enables the topbar to show the current team names, scores, and other relevant information based on the latest broadcast state received from the service.
   */
  state: WritableSignal<BroadcastState> = inject(BroadcastStateService).state;
  isConnected = inject(Signalr).isConnected;
}
