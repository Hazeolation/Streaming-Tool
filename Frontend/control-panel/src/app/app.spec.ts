import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import { App } from './app';
import { signal } from '@angular/core';
import { BroadcastStateService } from './services/broadcast-state';
import { BroadcastState } from './models/broadcast-state';
import { Socials } from './models/socials';
import { CommentatorBoxTimeData } from './models/commentator-box-time-data';
import { SocialsService } from './services/socials';
import { CommentatorBoxTimeDataService } from './services/commentator-box-time-data';

describe('App', () => {
  const mockState = signal<BroadcastState>({
    teamAlphaName: '',
    teamBravoName: '',
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
    division: 3,
    startTime: new Date(),
    week: 1,
    currentColorsId: 0,
    colorLockActive: false,
  });

  const mockSocials = signal<Socials>({
    xHandle: '@Test',
    discordInvite: 'DSB',
  });

  const mockTimeData = signal<CommentatorBoxTimeData>({
    hideDisplayIntervalInSeconds: 6,
    showDisplayIntervalInSeconds: 4,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: BroadcastStateService,
          useValue: {
            state: mockState,
          },
        },
        {
          provide: SocialsService,
          useValue: {
            socials: mockSocials,
          },
        },
        {
          provide: CommentatorBoxTimeDataService,
          useValue: {
            commentatorBoxTimeData: mockTimeData,
          },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    document.documentElement.style.removeProperty('--current-division-color');
    TestBed.resetTestingModule();
  });

  it('should create the app', () => {
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);
    const app: App = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have signal reachable', () => {
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);
    const app: App = fixture.componentInstance;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((app as any).title()).toBe('control-panel');
  });

  it('should set current division color css variable after render', async () => {
    const fixture: ComponentFixture<App> = TestBed.createComponent(App);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.documentElement.style.getPropertyValue('--current-division-color')).toBe(
      'var(--division-3-color)',
    );
  });
});
