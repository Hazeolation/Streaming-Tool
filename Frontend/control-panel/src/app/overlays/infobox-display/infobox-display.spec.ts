import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoboxDisplay } from './infobox-display';

describe('InfoboxDisplay', () => {
  let component: InfoboxDisplay;
  let fixture: ComponentFixture<InfoboxDisplay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoboxDisplay],
    }).compileComponents();

    fixture = TestBed.createComponent(InfoboxDisplay);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
