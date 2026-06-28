import {
  AfterContentInit,
  Component,
  inject,
  OnDestroy,
  OnInit,
  WritableSignal,
} from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { LogService } from '../../services/log';

@Component({
  selector: 'start-screen',
  imports: [],
  templateUrl: './start-screen.html',
  styleUrl: './start-screen.scss',
})
export class StartScreen implements OnInit, OnDestroy, AfterContentInit {
  /** Injected logger for lifecycle and countdown diagnostics. */
  private readonly log = inject(LogService);

  /** Broadcast state service used to load and expose overlay state. */
  stateService = inject(BroadcastStateService);

  /** Current broadcast state signal for the start screen. */
  state: WritableSignal<BroadcastState> = this.stateService.state;

  /** Active countdown timer handle, if one is currently running. */
  private countdownInterval: ReturnType<typeof setInterval> | undefined = undefined;

  /**
   * Initializes the component and requests the initial broadcast state.
   * @returns {void}
   */
  ngOnInit(): void {
    const scope = this.log.beginScope('StartScreen.ngOnInit');

    this.log.info('StartScreen initialized');

    try {
      this.log.debug('Loading initial broadcast state');

      this.stateService.loadInitialState();

      this.log.info('Broadcast state load requested');
    } catch (err) {
      this.log.error('Failed during StartScreen init', err);
    } finally {
      scope.dispose();
    }
  }

  /**
   * Sets up the countdown timer after content initialization.
   * @returns {void}
   */
  ngAfterContentInit(): void {
    const scope = this.log.beginScope('StartScreen.ngAfterContentInit');

    try {
      if (typeof document === 'undefined') {
        this.log.warn('Document is undefined - skipping countdown setup');
        return;
      }

      this.log.info('Initializing countdown timer');

      clearInterval(this.countdownInterval);

      const setCountdownTimer = () => {
        const timerElem = document.body.querySelector('.countdown-timer');

        if (!timerElem) {
          this.log.trace('Countdown element not found yet');
          return;
        }

        const startTime = new Date(this.state().startTime);

        const diffTime = new Date(startTime.getTime() - Date.now());

        if (diffTime.getTime() <= 0) {
          timerElem.textContent = 'SOON™';
          return;
        }

        let hours = diffTime.getUTCHours().toString();
        let minutes = diffTime.getUTCMinutes().toString();
        let seconds = diffTime.getUTCSeconds().toString();

        hours = hours.length > 1 ? hours : '0' + hours;
        minutes = minutes.length > 1 ? minutes : '0' + minutes;
        seconds = seconds.length > 1 ? seconds : '0' + seconds;

        const formatted = hours + ':' + minutes + ':' + seconds;

        timerElem.textContent = formatted;

        this.log.trace('Countdown updated', {
          formatted,
        });
      };

      setCountdownTimer();

      this.countdownInterval = setInterval(setCountdownTimer, 1000);

      this.log.info('Countdown timer started');
    } catch (err) {
      this.log.error('Failed setting up countdown timer', err);
    } finally {
      scope.dispose();
    }
  }

  /**
   * Cleans up the countdown timer when the component is destroyed.
   * @returns {void}
   */
  ngOnDestroy(): void {
    const scope = this.log.beginScope('StartScreen.ngOnDestroy');

    try {
      this.log.info('Cleaning up countdown timer');

      clearInterval(this.countdownInterval);

      this.log.info('StartScreen destroyed');
    } catch (err) {
      this.log.error('Error during StartScreen cleanup', err);
    } finally {
      scope.dispose();
    }
  }
}
