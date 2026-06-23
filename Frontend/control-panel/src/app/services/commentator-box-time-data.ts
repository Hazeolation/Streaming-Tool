import { effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { CommentatorBoxTimeDataApi } from './commentator-box-time-data-api';
import { Signalr } from './signalr';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';

@Injectable({
  providedIn: 'root',
})
export class CommentatorBoxTimeDataService {
  private readonly api: CommentatorBoxTimeDataApi = inject(CommentatorBoxTimeDataApi);
  private readonly signalr: Signalr = inject(Signalr);

  /**
   * Initializes the `CommentatorBoxTimeDataService` by setting up an effect that listens for incoming commentator box time data updates from the SignalR service.
   */
  constructor() {
    effect(() => {
      const incoming = this.signalr.liveCommentatorBoxTimeData();

      if (!incoming) return;

      this.commentatorBoxTimeData.set(incoming);
    });

    this.signalr.start();
  }

  /**
   * The main commentator box time data signal that holds the current commentator box time data.
   */
  commentatorBoxTimeData: WritableSignal<CommentatorBoxTimeData> = signal<CommentatorBoxTimeData>({
    hideDisplayIntervalInSeconds: 0,
    showDisplayIntervalInSeconds: 0,
  });

  /**
   * Updates the commentator box time data by merging the existing time data with the provided partial time data, then sends the updated time data to the backend API.
   * @param {Partial<CommentatorBoxTimeData>} partial The partial commentator box time data containing the properties to be updated in the current commentator box time data.
   */
  update(partial: Partial<CommentatorBoxTimeData>): void {
    const newTimeData = {
      ...this.commentatorBoxTimeData(),
      ...partial,
    };

    this.commentatorBoxTimeData.set(newTimeData);
    this.api.updateCommentatorBoxTimeData(newTimeData).subscribe();
  }

  /**
   * Loads the initial broadcast state from the backend API and sets it to the state signal. This method is typically called during the initialization of components that depend on the broadcast state to ensure they have the most up-to-date information when they start.
   */
  loadInitialState(): void {
    this.api.getCommentatorBoxTimeData().subscribe((timeData) => {
      this.commentatorBoxTimeData.set(timeData);
    });
  }
}
