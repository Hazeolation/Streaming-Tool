import { Component, inject, WritableSignal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BroadcastState } from '../../models/broadcast-state';
import { Division } from '../../models/division';
import { BroadcastStateService } from '../../services/broadcast-state';
import { Socials } from '../../models/socials';
import { SocialsService } from '../../services/socials';
import { CommentatorBoxTimeData } from '../../models/commentator-box-time-data';
import { CommentatorBoxTimeDataService } from '../../services/commentator-box-time-data';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';
import { CommBoxDisplayEvents } from '../../enums/comm-box-display-events';
import { SignalrEvents } from '../../services/signalr-events';
import { CommBoxDisplayMode } from '../../enums/comm-box-display-modes';

@Component({
  selector: 'app-sidebar',
  imports: [FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {
  /**
   * Instance for transmitting SignalrEvents
   */
  private signalrEvents: SignalrEvents = inject(SignalrEvents);

  /**
   * Logger instance for sidebar lifecycle and actions.
   */
  private readonly log: LogService = inject(LogService);

  /**
   * Scoped logger instance used for sidebar-specific logs.
   */
  private readonly scope: LogScope = this.log.beginScope('Sidebar');

  /**
   * Service that manages broadcast state and division data.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);

  /**
   * Service that manages social data for the sidebar.
   */
  socialsService: SocialsService = inject(SocialsService);

  /**
   * Service that manages commentator box time data.
   */
  commentatorBoxTimeDataService: CommentatorBoxTimeDataService = inject(
    CommentatorBoxTimeDataService,
  );

  /**
   * Writable signal representing the current broadcast state.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Writable signal representing the current social data.
   */
  socials: WritableSignal<Socials> = this.socialsService.socials;

  /**
   * Writable signal representing the commentator box time data.
   */
  commentatorBoxTimeData: WritableSignal<CommentatorBoxTimeData> =
    this.commentatorBoxTimeDataService.commentatorBoxTimeData;

  /**
   * Available divisions for the broadcast state.
   */
  availableDivisions: Division[] = this.stateService.availableDivisions;

  /**
   * Click event handling for the hide commentator box button
   */
  handleHideButtonClick(): void {
    this.log.trace('Firing click event for commentator box display button to Signalr EventHub', {
      type: CommBoxDisplayEvents.CommBoxHideButtonClicked,
    });
    this.signalrEvents.connection?.invoke(CommBoxDisplayEvents.CommBoxHideButtonClicked);
  }

  /**
   * Click event handling for the show commentator box button
   */
  handleShowButtonClick(): void {
    this.log.trace('Firing click event for commentator box display button to Signalr EventHub', {
      type: CommBoxDisplayEvents.CommBoxHideButtonClicked,
    });
    this.signalrEvents.connection?.invoke(CommBoxDisplayEvents.CommBoxShowButtonClicked);
  }

  /**
   * Click event handling for the show commentator box temporarily button
   */
  handleShowTempButtonClick(): void {
    this.log.trace('Firing click event for commentator box display button to Signalr EventHub', {
      type: CommBoxDisplayEvents.CommBoxHideButtonClicked,
    });
    this.signalrEvents.connection?.invoke(CommBoxDisplayEvents.CommBoxShowTempButtonClicked);
  }

  /**
   * Initialize the sidebar and load initial service state.
   * @returns void
   */
  ngOnInit(): void {
    this.log.info('Sidebar initializing');

    try {
      this.stateService.loadInitialState();
      this.socialsService.loadInitialState();
      this.commentatorBoxTimeDataService.loadInitialState();

      this.log.debug('Initial state load triggered', {
        hasStateService: !!this.stateService,
        hasSocialsService: !!this.socialsService,
        hasTimeDataService: !!this.commentatorBoxTimeDataService,
      });
    } catch (err) {
      this.log.error('Sidebar initialization failed', err);
    }
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   * @returns void
   */
  ngOnDestroy(): void {
    this.log.trace('Sidebar destroyed');
    this.scope.dispose();
  }

  /**
   * Getter that returns property of `CommBoxDisplayMode` type to access enum on HTML
   */
  get commBoxDisplayMode(): typeof CommBoxDisplayMode {
    return CommBoxDisplayMode;
  }
}
