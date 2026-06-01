import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { BroadcastState } from '../models/broadcast-state';

@Injectable({
  providedIn: 'root',
})
export class BroadcastApi {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = 'http://localhost:7000/api/broadcast';

  /**
   * Gets the current broadcast state from the backend API. This method sends an HTTP GET request to the specified endpoint (`/state`) of the broadcast API and returns an `Observable` that emits the `BroadcastState` object received from the backend. The `BroadcastState` contains all the relevant information about the current state of the broadcast, such as team names, scores, commentator information, map details, and various display settings. This method is essential for retrieving the latest broadcast state to ensure that the frontend UI can reactively update and display accurate information based on the current state of the broadcast.
   * @returns {Observable<BroadcastState>} An `Observable` that emits the `BroadcastState` object.
   */
  getState(): Observable<BroadcastState> {
    return this.http.get<BroadcastState>(`${this.baseUrl}/state`);
  }

  /**
   * Updates the broadcast state by sending an HTTP POST request to the specified endpoint (`/state`) of the broadcast API with the updated `BroadcastState` object as the request body. This method takes a `BroadcastState` object as a parameter, which contains all the necessary information to update the current state of the broadcast. When invoked, it sends the updated state to the backend, allowing the backend to process and apply the changes accordingly. The method returns an `Observable` that emits the updated `BroadcastState` object received from the backend after processing the update, ensuring that the frontend can reactively update its UI based on the new state of the broadcast.
   * @param {BroadcastState} state The updated broadcast state to be sent to the backend.
   * @returns {Observable<BroadcastState>} An `Observable` that emits the updated `BroadcastState` object.
   */
  updateState(state: BroadcastState): Observable<BroadcastState> {
    return this.http.post<BroadcastState>(`${this.baseUrl}/state`, state);
  }
}
