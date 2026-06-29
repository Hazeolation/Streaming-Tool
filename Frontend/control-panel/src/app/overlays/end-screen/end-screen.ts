import { Component, inject, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { BroadcastStateService } from '../../services/broadcast-state';
import { BroadcastState } from '../../models/broadcast-state';
import { SocialsService } from '../../services/socials';
import { Socials } from '../../models/socials';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';
@Component({
  selector: 'end-screen',
  imports: [],
  templateUrl: './end-screen.html',
  styleUrl: './end-screen.scss',
})
export class EndScreen implements OnInit, OnDestroy {
  /**
   * Logger service for debug and error logging.
   */
  private readonly log: LogService = inject(LogService);

  /**
   * Scope for the EndScreen overlay.
   */
  private readonly scope: LogScope = this.log.beginScope('EndScreen');

  /**
   * Service managing broadcast state.
   */
  stateService = inject(BroadcastStateService);
  /**
   * Service managing socials data.
   */
  socialsService = inject(SocialsService);

  /**
   * Current broadcast state.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Current socials information.
   */
  socials: WritableSignal<Socials> = this.socialsService.socials;

  /**
   * Initializes the end screen component and loads initial state.
   */
  ngOnInit(): void {
    const scope = this.log.beginScope('EndScreen.ngOnInit');

    this.log.info('EndScreen initialized');

    try {
      this.log.debug('Loading initial overlay state');

      this.stateService.loadInitialState();
      this.socialsService.loadInitialState();

      this.log.info('Initial overlay state requested');
    } catch (err) {
      this.log.error('Failed during EndScreen initialization', err);
    } finally {
      scope.dispose();
    }
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.log.trace('End Screen destroyed');
    this.scope.dispose();
  }
}
