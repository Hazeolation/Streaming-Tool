import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';
import { BroadcastStateService } from '../../services/broadcast-state';
import { SocialsService } from '../../services/socials';
import { CommentatorBoxTimeDataService } from '../../services/commentator-box-time-data';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';

@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, Topbar, RouterOutlet],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout implements OnInit, OnDestroy {
  /**
   * Logger instance for lifecycle and initialization events.
   */
  private readonly log: LogService = inject(LogService);

  /**
   * The scope manager for this component.
   */
  private readonly scope: LogScope = this.log.beginScope('MainLayout');

  /**
   * Broadcast state service used to initialize overlay state.
   */
  private readonly stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Socials service used to initialize social overlay state.
   */
  private readonly socialsService: SocialsService = inject(SocialsService);

  /**
   * Commentator box time data service used to initialize time overlay state.
   */
  private readonly commentatorBoxTimeDataService: CommentatorBoxTimeDataService = inject(
    CommentatorBoxTimeDataService,
  );

  /**
   * Initialize the main layout and bootstrap required overlay services.
   * @returns void
   */
  ngOnInit(): void {
    const scope: LogScope = this.log.beginScope('MainLayout.ngOnInit');

    this.log.info('MainLayout initialized');

    try {
      this.log.debug('Starting overlay bootstrap sequence');

      this.log.trace('Loading BroadcastStateService');
      this.stateService.loadInitialState();

      this.log.trace('Loading SocialsService');
      this.socialsService.loadInitialState();

      this.log.trace('Loading CommentatorBoxTimeDataService');
      this.commentatorBoxTimeDataService.loadInitialState();

      this.log.info('All initial overlay states requested');
    } catch (err) {
      this.log.error('Failed during main layout initialization', err);
    } finally {
      scope.dispose();
    }
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    this.log.trace('Main Layout destroyed.');
    this.scope.dispose();
  }
}
