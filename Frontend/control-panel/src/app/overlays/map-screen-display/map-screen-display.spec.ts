import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapScreenDisplay } from './map-screen-display';

describe('MapScreenDisplay', () => {
  let component: MapScreenDisplay;
  let fixture: ComponentFixture<MapScreenDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapScreenDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(MapScreenDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
