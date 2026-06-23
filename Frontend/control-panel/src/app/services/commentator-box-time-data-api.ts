import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';

@Injectable({
  providedIn: 'root',
})
export class CommentatorBoxTimeDataApi {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = 'http://localhost:7000/api/commentator-box-time-data';

  /**
   * Gets the current commentator box time data from the backend API.
   * @returns {Observable<CommentatorBoxTimeData>} An `Observable` that emits the `CommentatorBoxTimeData` object.
   */
  getCommentatorBoxTimeData(): Observable<CommentatorBoxTimeData> {
    return this.http.get<CommentatorBoxTimeData>(`${this.baseUrl}/commentator-box-time-data`);
  }

  /**
   * Updates the commentator box time data by sending an HTTP POST request to the specified endpoint (`/commentator-box-time-data`) of the commentator box time data API with the updated `CommentatorBoxTimeData` object as the request body.
   * @param {CommentatorBoxTimeData} socials The updated commentator box time data to be sent to the backend.
   * @returns {Observable<CommentatorBoxTimeData>} An `Observable` that emits the updated `CommentatorBoxTimeData` object.
   */
  updateCommentatorBoxTimeData(
    timeData: CommentatorBoxTimeData,
  ): Observable<CommentatorBoxTimeData> {
    return this.http.post<CommentatorBoxTimeData>(
      `${this.baseUrl}/commentator-box-time-data`,
      timeData,
    );
  }
}
