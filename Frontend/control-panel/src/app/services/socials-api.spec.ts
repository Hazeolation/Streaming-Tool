import { TestBed } from '@angular/core/testing';

import { SocialsApi } from './socials-api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Socials } from '../models/socials';
import { provideHttpClient, withFetch } from '@angular/common/http';

describe('SocialsApi', () => {
  let service: SocialsApi;
  let httpMock: HttpTestingController;

  const baseUrl = 'http://localhost:7000/api/socials';

  const mockSocials: Socials = {
    xHandle: "@Testing",
    discordInvite: "Testing"
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SocialsApi,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(SocialsApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get the current socials', () => {
    service.getSocials().subscribe((socials) => {
      expect(socials).toEqual(mockSocials);
    });

    const req = httpMock.expectOne(`${baseUrl}/socials`);

    expect(req.request.method).toBe('GET');

    req.flush(mockSocials);
  });

  it('should update the socials', () => {
    const updatedSocials: Socials = {
      ...mockSocials,
      discordInvite: "/DSB"
    };

    service.updateSocials(updatedSocials).subscribe((socials) => {
      expect(socials).toEqual(updatedSocials);
    });

    const req = httpMock.expectOne(`${baseUrl}/socials`);

    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(updatedSocials);

    req.flush(updatedSocials);
  });
});
