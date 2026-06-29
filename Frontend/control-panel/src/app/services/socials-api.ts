import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Socials } from '../models/socials';
import { LogService } from './log';

@Injectable({
  providedIn: 'root',
})
export class SocialsApi {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly log: LogService = inject(LogService);

  private readonly baseUrl: string = 'http://localhost:7000/api/socials';

  /**
   * Gets the current socials from the backend API.
   */
  getSocials(): Observable<Socials> {
    this.log.debug('GET socials request started');

    return this.http.get<Socials>(`${this.baseUrl}/socials`).pipe(
      tap((result) => {
        this.log.info('GET socials successful', {
          hasXHandle: !!result.xHandle,
          hasDiscordInvite: !!result.discordInvite,
        });
      }),
      catchError((err) => {
        this.log.error('GET socials failed', err);
        return throwError(() => err);
      }),
    );
  }

  /**
   * Updates the socials via backend API.
   */
  updateSocials(socials: Socials): Observable<Socials> {
    this.log.debug('POST socials request started', {
      hasXHandle: !!socials.xHandle,
      hasDiscordInvite: !!socials.discordInvite,
    });

    return this.http.post<Socials>(`${this.baseUrl}/socials`, socials).pipe(
      tap((result) => {
        this.log.info('POST socials successful', {
          hasXHandle: !!result.xHandle,
          hasDiscordInvite: !!result.discordInvite,
        });
      }),
      catchError((err) => {
        this.log.error('POST socials failed', err, socials);
        return throwError(() => err);
      }),
    );
  }
}
