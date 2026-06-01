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

  getState(): Observable<BroadcastState> {
    return this.http.get<BroadcastState>(`${this.baseUrl}/state`);
  }

  updateState(state: BroadcastState): Observable<BroadcastState> {
    return this.http.post<BroadcastState>(`${this.baseUrl}/state`, state);
  }
}
