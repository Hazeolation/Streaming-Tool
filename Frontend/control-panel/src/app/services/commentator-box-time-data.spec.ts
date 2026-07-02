import { TestBed } from '@angular/core/testing';
import { CommentatorBoxTimeDataService } from './commentator-box-time-data';
import { CommentatorBoxTimeDataApi } from './commentator-box-time-data-api';
import { CommentatorBoxTimeData } from '../models/commentator-box-time-data';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { Signalr } from './signalr';

describe('CommentatorBoxTimeData', () => {
  let timeData: CommentatorBoxTimeDataService;

  const defaultTimeData = {
    hideDisplayIntervalInSeconds: 0,
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

    mockSignalR.start.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        CommentatorBoxTimeDataService,
        {
          provide: CommentatorBoxTimeDataApi,
          useValue: mockApi,
        },
        {
          provide: Signalr,
          useValue: mockSignalR,
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

  it('should load initial time data from api', () => {
    const apiTimeData: CommentatorBoxTimeData = {
      ...defaultTimeData,
    };

    mockApi.getCommentatorBoxTimeData.mockReturnValue(of(apiTimeData));

    timeData.loadInitialState();

    expect(mockApi.getCommentatorBoxTimeData).toHaveBeenCalled();
    expect(timeData.commentatorBoxTimeData()).toEqual(apiTimeData);
  });

  it('should update time data and persist it through api', () => {
    timeData.update({
      ...defaultTimeData,
      hideDisplayIntervalInSeconds: 23,
    });

    const expectedTimeData: CommentatorBoxTimeData = {
      ...defaultTimeData,
      hideDisplayIntervalInSeconds: 23,
    };

    expect(timeData.commentatorBoxTimeData()).toEqual(expectedTimeData);
    expect(mockApi.updateCommentatorBoxTimeData).toHaveBeenCalledWith(expectedTimeData);
  });
});
