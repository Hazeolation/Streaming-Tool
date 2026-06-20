import { TestBed } from '@angular/core/testing';

import { SocialsService } from './socials';
import { Socials } from '../models/socials';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { SocialsApi } from './socials-api';
import { Signalr } from './signalr';



describe('Socials', () => {
  let service: SocialsService;

  const defaultSocials: Socials = {
    xHandle: "@Testing",
    discordInvite: "Testing"
  };

  const mockApi = {
    getSocials: vi.fn(),
    updateSocials: vi.fn(),
  };

  const mockLiveSocials = signal<Socials | null>(null);

  const mockSignalr = {
    liveSocials: mockLiveSocials,
    start: vi.fn(),
  };   

  beforeEach(() => {
    vi.clearAllMocks();

    mockLiveSocials.set(null);

    mockApi.getSocials.mockReturnValue(of(defaultSocials));
    mockApi.updateSocials.mockReturnValue(of(undefined));

    mockSignalr.start.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [
        SocialsService,
        { provide: SocialsApi, useValue: mockApi },
        { provide: Signalr, useValue: mockSignalr },
      ],
    });

    service = TestBed.inject(SocialsService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start signalr when created', () => {
    expect(mockSignalr.start).toHaveBeenCalled();
  });

  it('should load initial socials from api', () => {
    const apiSocials: Socials = {
      ...defaultSocials,
      discordInvite: "/DSB"
    };

    mockApi.getSocials.mockReturnValue(of(apiSocials));

    service.loadInitialState();

    expect(mockApi.getSocials).toHaveBeenCalled();
    expect(service.socials()).toEqual(apiSocials);
  });

  it('should update socials and persist it through api', () => {
    service.update({
      discordInvite: ".gg/DSB"
    });

    const expectedSocials: Socials = {
      ...defaultSocials,
      discordInvite: ".gg/DSB"
    };

    expect(service.socials()).toEqual(expectedSocials);
    expect(mockApi.updateSocials).toHaveBeenCalledWith(expectedSocials);
  });
});
