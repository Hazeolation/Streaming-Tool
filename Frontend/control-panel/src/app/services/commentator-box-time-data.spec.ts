import { TestBed } from '@angular/core/testing';
import { CommentatorBoxTimeDataService } from './commentator-box-time-data';
import { CommentatorBoxTimeDataApi } from './commentator-box-time-data-api';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';
import { signal } from '@angular/core';
import { of } from 'rxjs';

describe('CommentatorBoxTimeData', () => {
  let timeData: CommentatorBoxTimeDataService;

  const defaultTimeData = {
    hideDisplayIntervalInSeconds: 0,
    showDisplayIntervalInSeconds: 0,
  };

  const mockApi = {
    getCommentatorBoxTimeData: vi.fn(),
    updateCommentatorBoxTimeData: vi.fn(),
  };

  const mockLiveTimeData = signal<CommentatorBoxTimeData | null>(null);

  const mockSignalR = {
    liveCommentatorBoxTimeData: mockLiveTimeData,
    start: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockLiveTimeData.set(null);

    mockApi.getCommentatorBoxTimeData.mockReturnValue(of(defaultTimeData));
    mockApi.updateCommentatorBoxTimeData.mockReturnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        CommentatorBoxTimeDataService,
        {
          provide: CommentatorBoxTimeDataApi,
          useValue: mockApi,
        },
      ],
    });

    timeData = TestBed.inject(CommentatorBoxTimeDataService);
  });

  afterEach(async () => {
    TestBed.resetTestingModule();
  });

  it('should be created', async () => {
    expect(timeData).toBeTruthy();
  });
});
