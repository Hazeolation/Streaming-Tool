import { Component, inject, WritableSignal } from '@angular/core';
import { MapCard } from '../../features/map-card/map-card';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';

@Component({
  selector: 'app-dashboard',
  imports: [MapCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  /**
   * The log service
   */
  private readonly log: LogService = inject(LogService);

  /**
   * The scope for the Dashboard page
   */
  private readonly scope: LogScope = this.log.beginScope('Dashboard');

  /**
   * The BroadcastStateService
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Reactive broadcast state
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  constructor() {
    this.log.info('Dashboard component initialized', {
      initialMapCount: this.state().maps?.length ?? 0,
    });
  }

  /**
   * Adds a new map to the broadcast state
   */
  addMap(): void {
    this.log.debug('Dashboard: addMap triggered', {
      currentMapCount: this.state().maps?.length ?? 0,
    });

    try {
      this.stateService.addMap();

      this.log.info('Map added successfully via Dashboard');
    } catch (err) {
      this.log.error('Failed to add map from Dashboard', err);
    }
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.log.trace('Dashboard destroyed');
    this.scope.dispose();
  }
}
