import { Component, inject, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { CommentatorBox } from '../commentator-box/commentator-box';
import { ResizableText } from '../../features/resizable-text/resizable-text';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';

@Component({
  selector: 'app-infobox-display',
  imports: [CommentatorBox, ResizableText],
  templateUrl: './infobox-display.html',
  styleUrl: './infobox-display.scss',
})
export class InfoboxDisplay implements OnInit, OnDestroy {
  /**
   * Logging service.
   */
  private readonly log: LogService = inject(LogService);

  /**
   * Scope for the Infobox overlay.
   */
  private readonly scope: LogScope = this.log.beginScope('Infobox');

  /**
   * Broadcast state service.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Current broadcast state.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Initializes the infobox display component and loads broadcast state.
   */
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

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.log.trace('Infobox Display destroyed');
    this.scope.dispose();
  }
}
