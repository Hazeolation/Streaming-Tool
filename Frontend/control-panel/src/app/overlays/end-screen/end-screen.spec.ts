import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EndScreen } from './end-screen';
import { BroadcastState } from '../../models/broadcast-state';
import { signal } from '@angular/core';
import { BroadcastStateService } from '../../services/broadcast-state';

describe('EndScreen', () => {
  let component: EndScreen;
  let fixture: ComponentFixture<EndScreen>;

  const defaultState: BroadcastState = {
    teamAlphaName: 'Team Alpha',
    teamBravoName: 'Team Bravo',
    alphaIsLeft: true,
    scoreAlpha: 2,
    scoreBravo: 1,
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
  };

  const mockState = signal<BroadcastState>(defaultState);

  const mockStateService = {
    state: mockState,
    loadInitialState: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    mockState.set(defaultState);

    await TestBed.configureTestingModule({
      imports: [EndScreen],
      providers: [
        {
          provide: BroadcastStateService,
          useValue: mockStateService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EndScreen);
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

  it('should expose the state signal from BroadcastStateService', () => {
    expect(component.state).toBe(mockStateService.state);
    expect(component.state()).toEqual(defaultState);
  });

  it('should load initial state on init', () => {
    expect(mockStateService.loadInitialState).toHaveBeenCalledOnce();
  });
});
