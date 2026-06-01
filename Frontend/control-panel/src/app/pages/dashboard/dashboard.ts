import { Component, inject, WritableSignal } from '@angular/core';
import { MapCard } from '../../features/map-card/map-card';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-dashboard',
  imports: [MapCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  /**
   * Injects the `BroadcastStateService` to access the current broadcast state and available maps, modes, and divisions. The `state` signal is used to reactively track changes to the broadcast state, allowing the dashboard component to update its UI accordingly whenever the state changes. This setup enables the dashboard to display the current configuration of the broadcast and provide controls for modifying it through the service's methods.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * A writable signal that holds the current broadcast state. It is initialized by referencing the `state` signal from the `BroadcastStateService`, allowing the dashboard component to reactively update its UI whenever the broadcast state changes. This signal is used throughout the dashboard to display current settings and configurations, such as selected maps, modes, and divisions, and to provide interactive controls for modifying the state.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Adds a new map to the current broadcast state by calling the `addMap` method on the `BroadcastStateService`. This method is typically triggered by a user action, such as clicking an "Add Map" button in the UI. When invoked, it updates the broadcast state to include a new map slot, allowing the user to select a map for that slot from the available maps defined in the service.
   */
  addMap(): void {
    this.stateService.addMap();
  }
}
