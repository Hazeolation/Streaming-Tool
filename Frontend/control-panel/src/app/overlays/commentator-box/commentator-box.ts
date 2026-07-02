import { Component, inject, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { BroadcastStateService } from '../../services/broadcast-state';
import { CommentatorBoxTimeDataService } from '../../services/commentator-box-time-data';
import { SocialsService } from '../../services/socials';
import { LogService } from '../../services/log';
import { Socials } from '../../models/socials';
import { CommentatorBoxTimeData } from '../../models/commentator-box-time-data';
import { BroadcastState } from '../../models/broadcast-state';
import { LogScope } from '../../models/log-scope';
import { CommBoxDisplayEvents } from '../../enums/comm-box-display-events';
import { SignalrEvents } from '../../services/signalr-events';

@Component({
  host: {
    '[class.hide-comm-box]': 'commboxHidden()',
  },
  selector: 'app-commentator-box',
  imports: [],
  templateUrl: './commentator-box.html',
  styleUrl: './commentator-box.scss',
})
export class CommentatorBox implements OnInit, OnDestroy {
  /**
   * Whether the component is displayed on the score box
   */
  @Input() onScoreBox: boolean = false;

  /**
   * Signal indicating if the interval is hidden.
   */
  commboxHidden: WritableSignal<boolean> = signal<boolean>(false);

  /**
   * Service for managing broadcast state.
   */
  stateService: BroadcastStateService = inject(BroadcastStateService);
  /**
   * Service for managing commentator box time data.
   */
  commentatorBoxTimeDataService: CommentatorBoxTimeDataService = inject(
    CommentatorBoxTimeDataService,
  );
  /**
   * Service for managing socials data.
   */
  socialsService: SocialsService = inject(SocialsService);

  /**
   * Current broadcast state.
   */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /**
   * Commentator box time configuration.
   */
  commentatorBoxTimeData: WritableSignal<CommentatorBoxTimeData> =
    this.commentatorBoxTimeDataService.commentatorBoxTimeData;

  /**
   * Socials data.
   */
  socials: WritableSignal<Socials> = this.socialsService.socials;

  /**
   * Service for logging
   */
  private readonly log: LogService = inject(LogService);

  /**
   * Logging scope created for the CommentatorBox overlay.
   */
  private readonly scope: LogScope = this.log.beginScope('CommentatorBox');

  /**
   * Timeout for hiding the display.
   */
  private hideDisplayTimeout: ReturnType<typeof setTimeout> | undefined;

  private signalrEvents: SignalrEvents = inject(SignalrEvents);

  /**
   * Get the formatted commentator text based on the current broadcast state.
   * @returns {string} The formatted commentator text for the current broadcast state.
   */
  get commentatorsText(): string {
    const c1 = this.state().commentator1;
    const c2 = this.state().commentator2;

    return c1 && !c2
      ? `Kommentator: ${c1}`
      : c2 && !c1
        ? `Kommentator: ${c2}`
        : `Kommentatoren: ${c1 || 'Kommentator 1'}, ${c2 || 'Kommentator 2'}`;
  }

  /**
   * Handles the hide commentator box event that gets received from signalr event hub
   */
  handleHideEvent = () => {
    clearTimeout(this.hideDisplayTimeout);

    this.log.trace('Commentator box hide click event received, hiding comm box');
    this.commboxHidden.set(true);
  };

  /**
   * Handles the show commentator box event that gets received from signalr event hub
   */
  handleShowEvent = () => {
    clearTimeout(this.hideDisplayTimeout);

    this.log.trace('Commentator box hide click event received, hiding comm box');
    this.commboxHidden.set(false);
  };

  /**
   * Handles the show commentator box temporarily event that gets received from signalr event hub
   */
  handleShowTempEvent = () => {
    clearTimeout(this.hideDisplayTimeout);

    const hideIntervalInSeconds = this.commentatorBoxTimeData().hideDisplayIntervalInSeconds * 1000;
    this.log.trace('Commentator box show temporarily click event received, show comm box', {
      hideIntervalInSeconds: hideIntervalInSeconds,
    });

    this.commboxHidden.set(false);
    this.hideDisplayTimeout = setTimeout(() => {
      this.log.trace('Interval finished, hiding comm box');
      this.commboxHidden.set(true);
    }, hideIntervalInSeconds);
  };

  /**
   * Connect all signalr event listeners on component init
   */
  connectEventListeners(): void {
    this.signalrEvents.connection?.on(
      CommBoxDisplayEvents.CommBoxHideButtonClicked,
      this.handleHideEvent,
    );
    this.signalrEvents.connection?.on(
      CommBoxDisplayEvents.CommBoxShowButtonClicked,
      this.handleShowEvent,
    );
    this.signalrEvents.connection?.on(
      CommBoxDisplayEvents.CommBoxShowTempButtonClicked,
      this.handleShowTempEvent,
    );
  }

  /**
   * Disconnect all signalr event listeners on component destroy
   */
  disconnectEventListeners(): void {
    this.signalrEvents.connection?.off(CommBoxDisplayEvents.CommBoxHideButtonClicked);
    this.signalrEvents.connection?.off(CommBoxDisplayEvents.CommBoxShowButtonClicked);
    this.signalrEvents.connection?.off(CommBoxDisplayEvents.CommBoxShowTempButtonClicked);
  }

  /**
   * Initialize services and load initial state when the component is created.
   */
  ngOnInit(): void {
    this.log.trace('CommentatorBox initialized', {
      onScoreBox: this.onScoreBox,
    });

    if (this.onScoreBox) {
      this.log.trace(
        'CommentatorBox is on score box page, add Signalr EventHub listener for button click events',
      );
      this.connectEventListeners();
    }

    this.commboxHidden.set(this.onScoreBox);

    this.stateService.loadInitialState();
    this.commentatorBoxTimeDataService.loadInitialState();
    this.socialsService.loadInitialState();
  }

  /**
   * Angular lifecycle hook called when the component is destroyed.
   */
  ngOnDestroy(): void {
    clearTimeout(this.hideDisplayTimeout);

    this.log.trace('CommentatorBox destroyed');
    this.scope.dispose();
    this.disconnectEventListeners();
  }
}
