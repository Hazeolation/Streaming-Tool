import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentatorBoxTimeDataApi } from './commentator-box-time-data-api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CommBoxDisplayMode } from '../enums/comm-box-display-modes';

describe('CommentatorBoxTimeDataApi', () => {
  let service: CommentatorBoxTimeDataApi;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:7000/api/commentator-box-time-data';

  const mockTimeData: CommentatorBoxTimeData = {
    showDisplayIntervalInSeconds: 100,
    hideDisplayIntervalInSeconds: 50,
    displayMode: CommBoxDisplayMode.Manual,
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [CommentatorBoxTimeDataApi, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CommentatorBoxTimeDataApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the current time data', () => {
    service.getCommentatorBoxTimeData().subscribe((timeData) => {
      expect(timeData).toEqual(mockTimeData);
    });

    const req = httpMock.expectOne(`${baseUrl}/commentator-box-time-data`);

    expect(req.request.method).toBe('GET');

    req.flush(mockTimeData);
  });

  it('should update the time data', () => {
    const updatedTimeData: CommentatorBoxTimeData = {
      ...mockTimeData,
      hideDisplayIntervalInSeconds: 23,
    };

    service.updateCommentatorBoxTimeData(updatedTimeData).subscribe((timeData) => {
      expect(timeData).toEqual(updatedTimeData);
    });

    const req = httpMock.expectOne(`${baseUrl}/commentator-box-time-data`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(updatedTimeData);

    req.flush(updatedTimeData);
  });
});
