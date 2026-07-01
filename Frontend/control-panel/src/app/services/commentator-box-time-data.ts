import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CommentatorBoxTimeDataApi } from './commentator-box-time-data-api';
import { Signalr } from './signalr';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';
import { SignalrServiceConnection } from '../enums/SignalrServiceConnection';
import { LogService } from './log';

@Injectable({
  providedIn: 'root',
})
export class CommentatorBoxTimeDataService {
  private readonly api = inject(CommentatorBoxTimeDataApi);
  private readonly signalr = inject(Signalr);
  private readonly log = inject(LogService);

  /**
   * Main state signal
   */
  commentatorBoxTimeData: WritableSignal<CommentatorBoxTimeData> = signal<CommentatorBoxTimeData>({
    hideDisplayIntervalInSeconds: 50,
    showDisplayIntervalInSeconds: 5,
  });

  /**
   * Initializes service + SignalR subscription
   */
  constructor() {
    const scope = this.log.beginScope('CommentatorBoxTimeDataService');

    this.log.info('Initializing CommentatorBoxTimeDataService');

    effect(() => {
      const incoming = this.signalr.liveCommentatorBoxTimeData();

      if (!incoming) return;

      this.log.debug('Received SignalR time data update', incoming);

      this.commentatorBoxTimeData.set(incoming);

      this.log.info('CommentatorBoxTimeData updated from SignalR');
    });

    this.signalr.connectionType = SignalrServiceConnection.CommentatorBoxTimeData;

    this.signalr.start();

    this.log.info('SignalR connection started for CommentatorBoxTimeData');

    scope.dispose();
  }

  /**
   * Updates time data (optimistic update + API sync)
   */
  update(partial: Partial<CommentatorBoxTimeData>): void {
    const scope = this.log.beginScope('CommentatorBoxTimeDataService.update');

    try {
      const before = this.commentatorBoxTimeData();

      const newTimeData = {
        ...before,
        ...partial,
      };

      this.log.debug('Updating commentator box time data', {
        before,
        patch: partial,
        after: newTimeData,
      });

      this.commentatorBoxTimeData.set(newTimeData);

      this.api.updateCommentatorBoxTimeData(newTimeData).subscribe({
        next: (result) => {
          this.log.info('Time data successfully updated via API', result);
        },
        error: (err) => {
          this.log.error('Failed to update time data', err, newTimeData);
        },
      });
    } finally {
      scope.dispose();
    }
  }

  /**
   * Loads initial state from backend
   */
  loadInitialState(): void {
    const scope = this.log.beginScope('CommentatorBoxTimeDataService.loadInitialState');

    this.log.info('Loading initial time data');

    this.api.getCommentatorBoxTimeData().subscribe({
      next: (timeData) => {
        this.log.debug('Initial time data received', timeData);

        this.commentatorBoxTimeData.set(timeData);

        this.log.info('Initial time data applied');
      },
      error: (err) => {
        this.log.error('Failed to load initial time data', err);
      },
    });

    scope.dispose();
  }
}
