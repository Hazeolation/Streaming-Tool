import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BroadcastState } from '../models/broadcast-state';

@Injectable({
  providedIn: 'root',
})
export class BroadcastApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:7000/api/broadcast';

  getState() {
    return this.http.get<BroadcastState>(`${this.baseUrl}/state`);
  }

  updateState(state: BroadcastState) {
    return this.http.post(`${this.baseUrl}/state`, state);
  }
}
