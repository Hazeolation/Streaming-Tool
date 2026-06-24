import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CommentatorBox } from './commentator-box';
import { BroadcastStateService } from '../../services/broadcast-state';
import { BroadcastState } from '../../models/broadcast-state';
import { CommentatorBoxTimeData } from '../../models/commentator-box-time-data';
import { CommentatorBoxTimeDataService } from '../../services/commentator-box-time-data';

describe('CommentatorBox', () => {
  let component: CommentatorBox;
  let fixture: ComponentFixture<CommentatorBox>;

  const defaultState: BroadcastState = {
    teamAlphaName: 'Team Alpha',
    teamBravoName: 'Team Bravo',
    alphaIsLeft: true,
    scoreAlpha: 0,
    scoreBravo: 0,
    streamer: '',
    commentator1: '',
    commentator2: '',
    showMapScreen: true,
    showScoreBox: true,
    showCommentatorBox: true,
    showInfobox: true,
    maps: [],
    season: 10,
    division: 1,
    startTime: new Date(),
    week: 1,
  };

  const defaultTimeData: CommentatorBoxTimeData = {
    showDisplayIntervalInSeconds: 1,
    hideDisplayIntervalInSeconds: 2,
  };

  const mockState = signal<BroadcastState>(defaultState);
  const mockTimeData = signal<CommentatorBoxTimeData>(defaultTimeData);

  const mockStateService = {
    state: mockState,
    loadInitialState: vi.fn(),
  };

  const mockTimeDataService = {
    commentatorBoxTimeData: mockTimeData,
    loadInitialState: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockState.set(defaultState);

    await TestBed.configureTestingModule({
      imports: [CommentatorBox],
      providers: [
        {
          provide: BroadcastStateService,
          useValue: mockStateService,
        },
        {
          provide: CommentatorBoxTimeDataService,
          useValue: mockTimeDataService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentatorBox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should inject BroadcastStateService', () => {
    expect(component.stateService).toBe(mockStateService);
  });

  it('should inject CommentatorBoxTimeDataService', () => {
    expect(component.commentatorBoxTimeDataService).toBe(mockTimeDataService);
  });

  it('should expose the state signal from BroadcastStateService', () => {
    expect(component.state).toBe(mockStateService.state);
    expect(component.state()).toEqual(defaultState);
  });

  it('should call loadInitialState on init', () => {
    expect(mockStateService.loadInitialState).toHaveBeenCalledOnce();
  });

  it('should reflect commentator changes from BroadcastStateService', () => {
    const updatedState: BroadcastState = {
      ...defaultState,
      streamer: 'Streamer',
      commentator1: 'Commentator One',
      commentator2: 'Commentator Two',
    };

    mockState.set(updatedState);

    expect(component.state()).toEqual(updatedState);
    expect(component.state().streamer).toBe('Streamer');
    expect(component.state().commentator1).toBe('Commentator One');
    expect(component.state().commentator2).toBe('Commentator Two');
  });

  it('should reflect commentator box time data changes from CommentatorBoxTimeDataService', () => {
    const updatedTimeData: CommentatorBoxTimeData = {
      ...defaultState,
      showDisplayIntervalInSeconds: 6,
      hideDisplayIntervalInSeconds: 12,
    };

    mockTimeData.set(updatedTimeData);

    expect(component.commentatorBoxTimeData()).toEqual(updatedTimeData);
    expect(component.commentatorBoxTimeData().hideDisplayIntervalInSeconds).toBe(12);
    expect(component.commentatorBoxTimeData().showDisplayIntervalInSeconds).toBe(6);
  });
});
