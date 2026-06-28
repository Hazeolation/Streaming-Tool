import { Component, inject, OnInit, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { CommentatorBox } from '../commentator-box/commentator-box';
import { LogService } from '../../services/log';

@Component({
  selector: 'app-infobox-display',
  imports: [CommentatorBox],
  templateUrl: './infobox-display.html',
  styleUrl: './infobox-display.scss',
})
export class InfoboxDisplay implements OnInit {
  /** Logging service. */
  private readonly log = inject(LogService);

  /** Broadcast state service. */
  stateService = inject(BroadcastStateService);

  /** Current broadcast state. */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /** Initializes the infobox display component and loads broadcast state. */
  ngOnInit(): void {
    const scope = this.log.beginScope('InfoboxDisplay.ngOnInit');

    this.log.info('InfoboxDisplay initialized');

    try {
      this.log.debug('Loading broadcast state for infobox');

      this.stateService.loadInitialState();

      this.log.info('Broadcast state load requested');
    } catch (err) {
      this.log.error('Failed during InfoboxDisplay initialization', err);
    } finally {
      scope.dispose();
    }
  }
}
