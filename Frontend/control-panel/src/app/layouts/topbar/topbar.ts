import { Component, inject, OnDestroy, OnInit, WritableSignal, effect } from '@angular/core';
import { BroadcastState } from '../../models/broadcast-state';
import { BroadcastStateService } from '../../services/broadcast-state';
import { Signalr } from '../../services/signalr';
import { LogService } from '../../services/log';
import { LogScope } from '../../models/log-scope';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar implements OnInit, OnDestroy {
  /**
   * Logger instance for topbar events.
   */
  private readonly log: LogService = inject(LogService);

  /**
   * Logging scope created for the topbar component.
   */
  private readonly scope: LogScope = this.log.beginScope('Topbar');

  /**
   * Broadcast state signal shared across the application.
   */
  state: WritableSignal<BroadcastState> = inject(BroadcastStateService).state;

  /**
   * SignalR connection state signal.
   */
  isConnected = inject(Signalr).isConnected;

  /**
   * Effect that logs SignalR connection state changes.
   */
  private connectionEffect = effect(() => {
    const connected = this.isConnected();

    this.log.debug('SignalR connection state changed', {
      connected,
    });
  });

  /**
   * Angular lifecycle hook called after component initialization.
   * @returns {void}
   */
  ngOnInit(): void {
    this.log.info('Topbar initialized');

    this.log.debug('Initial state snapshot', {
      teamAlpha: this.state().teamAlphaName,
      teamBravo: this.state().teamBravoName,
      connected: this.isConnected(),
    });
  }

  /**
   * Angular lifecycle hook called before component destruction.
   * @returns {void}
   */
  ngOnDestroy(): void {
    this.log.info('Topbar destroyed');

    this.connectionEffect.destroy();
    this.scope.dispose();
  }
}
