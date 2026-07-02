import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';
import { LogService } from './log';

@Injectable({
  providedIn: 'root',
})
export class CommentatorBoxTimeDataApi {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly log: LogService = inject(LogService);

  private readonly baseUrl: string = 'http://localhost:7000/api/commentator-box-time-data';

  /**
   * GET commentator box time data
   */
  getCommentatorBoxTimeData(): Observable<CommentatorBoxTimeData> {
    this.log.debug('GET commentator box time data request started');

    return this.http.get<CommentatorBoxTimeData>(`${this.baseUrl}/commentator-box-time-data`).pipe(
      tap((result) => {
        this.log.info('GET commentator box time data successful', {
          hideDisplayIntervalInSeconds: result.hideDisplayIntervalInSeconds,
        });
      }),
      catchError((err) => {
        this.log.error('GET commentator box time data failed', err);

        return throwError(() => err);
      }),
    );
  }

  /**
   * POST commentator box time data
   */
  updateCommentatorBoxTimeData(
    timeData: CommentatorBoxTimeData,
  ): Observable<CommentatorBoxTimeData> {
    this.log.debug('POST commentator box time data request started', {
      hideDisplayIntervalInSeconds: timeData.hideDisplayIntervalInSeconds,
    });

    return this.http
      .post<CommentatorBoxTimeData>(`${this.baseUrl}/commentator-box-time-data`, timeData)
      .pipe(
        tap((result) => {
          this.log.info('POST commentator box time data successful', {
            hideDisplayIntervalInSeconds: result.hideDisplayIntervalInSeconds,
          });
        }),
        catchError((err) => {
          this.log.error('POST commentator box time data failed', err, timeData);

          return throwError(() => err);
        }),
      );
  }
}
