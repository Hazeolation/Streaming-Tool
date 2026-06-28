import {
  Component,
  effect,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { BroadcastStateService } from '../../services/broadcast-state';
import { CommentatorBoxTimeDataService } from '../../services/commentator-box-time-data';
import { SocialsService } from '../../services/socials';
import { LogService } from '../../services/log';

@Component({
  host: {
    '[class.interval-hidden]': 'intervalHidden()',
  },
  selector: 'app-commentator-box',
  imports: [],
  templateUrl: './commentator-box.html',
  styleUrl: './commentator-box.scss',
})
export class CommentatorBox implements OnInit, OnDestroy {
  private readonly log = inject(LogService);

  /** Whether the component is displayed on the map screen. */
  @Input() onMapScreen: boolean = false;

  /** Signal indicating if the interval is hidden. */
  intervalHidden: WritableSignal<boolean> = signal<boolean>(false);

  /** Service for managing broadcast state. */
  stateService = inject(BroadcastStateService);
  /** Service for managing commentator box time data. */
  commentatorBoxTimeDataService = inject(CommentatorBoxTimeDataService);
  /** Service for managing socials data. */
  socialsService = inject(SocialsService);

  /** Current broadcast state. */
  state = this.stateService.state;

  /** Commentator box time configuration. */
  commentatorBoxTimeData = this.commentatorBoxTimeDataService.commentatorBoxTimeData;

  /** Socials data. */
  socials = this.socialsService.socials;

  /** Timeout for hiding the display. */
  private hideDisplayTimeout: ReturnType<typeof setTimeout> | undefined;

  /** Timeout for showing the display. */
  private showDisplayTimeout: ReturnType<typeof setTimeout> | undefined;

  /** Reactive effect managing interval-based visibility of the commentator box. */
  private commBoxDisplayIntervalEffect = effect(() => {
    const config = this.commentatorBoxTimeData();

    clearTimeout(this.hideDisplayTimeout);
    clearTimeout(this.showDisplayTimeout);

    this.log.debug('CommentatorBox interval effect triggered', {
      onMapScreen: this.onMapScreen,
      hideInterval: config.hideDisplayIntervalInSeconds,
      showInterval: config.showDisplayIntervalInSeconds,
    });

    if (
      !this.onMapScreen ||
      config.hideDisplayIntervalInSeconds === 0 ||
      config.showDisplayIntervalInSeconds === 0
    ) {
      this.intervalHidden.set(false);

      this.log.info('CommentatorBox forced visible (interval disabled or not map screen)');

      return;
    }

    this.intervalHidden.set(true);

    this.log.info('CommentatorBox interval cycling started', {
      hideInterval: config.hideDisplayIntervalInSeconds,
      showInterval: config.showDisplayIntervalInSeconds,
    });

    this.setHideDisplayIntervalTimeout();
  });

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

  /** Schedule the timeout to show the commentator box after the configured interval. */
  private setShowDisplayIntervalTimeout(): void {
    this.log.debug('Scheduling show interval timeout');

    this.showDisplayTimeout = setTimeout(() => {
      this.intervalHidden.set(false);

      this.log.debug('CommentatorBox shown');

      this.setHideDisplayIntervalTimeout();
    }, this.commentatorBoxTimeData().showDisplayIntervalInSeconds * 1000);
  }

  /** Schedule the timeout to hide the commentator box after the configured interval. */
  private setHideDisplayIntervalTimeout(): void {
    this.log.debug('Scheduling hide interval timeout');

    this.hideDisplayTimeout = setTimeout(() => {
      this.intervalHidden.set(true);

      this.log.debug('CommentatorBox hidden');

      this.setShowDisplayIntervalTimeout();
    }, this.commentatorBoxTimeData().hideDisplayIntervalInSeconds * 1000);
  }

  /** Initialize services and load initial state when the component is created. */
  ngOnInit(): void {
    this.log.info('CommentatorBox initialized', {
      onMapScreen: this.onMapScreen,
    });

    this.stateService.loadInitialState();
    this.commentatorBoxTimeDataService.loadInitialState();
    this.socialsService.loadInitialState();
  }

  /** Cleanup timeouts and destroy the interval effect when the component is destroyed. */
  ngOnDestroy(): void {
    this.log.info('CommentatorBox destroyed');

    clearTimeout(this.hideDisplayTimeout);
    clearTimeout(this.showDisplayTimeout);

    this.commBoxDisplayIntervalEffect.destroy();
  }
}
