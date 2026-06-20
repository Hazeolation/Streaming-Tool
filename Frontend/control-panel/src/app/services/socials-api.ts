import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socials } from '../models/socials';

@Injectable({
  providedIn: 'root',
})
export class SocialsApi {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = 'http://localhost:7000/api/socials';

  /**s
   * Gets the current socials from the backend API.
   * @returns {Observable<Socials>} An `Observable` that emits the `Socials` object.
   */
  getSocials(): Observable<Socials> {
    return this.http.get<Socials>(`${this.baseUrl}/socials`);
  }

  /**
   * Updates the socials by sending an HTTP POST request to the specified endpoint (`/socials`) of the socials API with the updated `Socials` object as the request body.
   * @param {Socials} socials The updated socials to be sent to the backend.
   * @returns {Observable<Socials>} An `Observable` that emits the updated `BroadcastState` object.
   */
  updateSocials(socials: Socials): Observable<Socials> {
    return this.http.post<Socials>(`${this.baseUrl}/socials`, socials);
  }
}
