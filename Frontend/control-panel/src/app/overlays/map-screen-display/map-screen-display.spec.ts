import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MapScreenDisplay } from './map-screen-display';
import { BroadcastStateService } from '../../services/broadcast-state';
import { BroadcastState } from '../../models/broadcast-state';


describe('MapScreenDisplay', () => {
  let component: MapScreenDisplay;
  let fixture: ComponentFixture<MapScreenDisplay>;

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
  };

  const mockState = signal<BroadcastState>(defaultState);

  const mockStateService = {
    state: mockState,
    loadInitialState: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    mockState.set(defaultState);
    document.documentElement.style.removeProperty('--current-division-color');

    await TestBed.configureTestingModule({
      imports: [MapScreenDisplay],
      providers: [
        {
          provide: BroadcastStateService,
          useValue: mockStateService,
        },
      ],
    })
      .overrideComponent(MapScreenDisplay, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MapScreenDisplay);
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

  it('should return alpha team name as left team name when alpha is left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: true,
      teamAlphaName: 'Alpha',
      teamBravoName: 'Bravo',
    });

    expect(component.leftTeamName).toBe('Alpha');
  });

  it('should return bravo team name as right team name when alpha is left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: true,
      teamAlphaName: 'Alpha',
      teamBravoName: 'Bravo',
    });

    expect(component.rightTeamName).toBe('Bravo');
  });

  it('should return alpha score as left score when alpha is left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: true,
      scoreAlpha: 5,
      scoreBravo: 3,
    });

    expect(component.leftScore).toBe(5);
  });

  it('should return bravo score as right score when alpha is left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: true,
      scoreAlpha: 5,
      scoreBravo: 3,
    });

    expect(component.rightScore).toBe(3);
  });

  it('should return bravo team name as left team name when alpha is not left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: false,
      teamAlphaName: 'Alpha',
      teamBravoName: 'Bravo',
    });

    expect(component.leftTeamName).toBe('Bravo');
  });

  it('should return alpha team name as right team name when alpha is not left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: false,
      teamAlphaName: 'Alpha',
      teamBravoName: 'Bravo',
    });

    expect(component.rightTeamName).toBe('Alpha');
  });

  it('should return bravo score as left score when alpha is not left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: false,
      scoreAlpha: 5,
      scoreBravo: 3,
    });

    expect(component.leftScore).toBe(3);
  });

  it('should return alpha score as right score when alpha is not left', () => {
    mockState.set({
      ...defaultState,
      alphaIsLeft: false,
      scoreAlpha: 5,
      scoreBravo: 3,
    });

    expect(component.rightScore).toBe(5);
  });

  it('should set current division color css variable after render', async () => {
    mockState.set({
      ...defaultState,
      division: 3,
    });

    fixture.detectChanges();

    await fixture.whenStable();

    expect(
      document.documentElement.style.getPropertyValue(
        '--current-division-color'
      )
    ).toBe('var(--division-3-color)');
  });

  it('should destroy division effect on destroy', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const destroySpy = vi.spyOn((component as any).divisionEffect, 'destroy');

    component.ngOnDestroy();

    expect(destroySpy).toHaveBeenCalledOnce();
  });
});