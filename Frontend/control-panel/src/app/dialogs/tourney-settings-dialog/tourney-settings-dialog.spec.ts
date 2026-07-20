import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourneySettingsDialog } from './tourney-settings-dialog';

describe('TourneySettingsDialog', () => {
  let component: TourneySettingsDialog;
  let fixture: ComponentFixture<TourneySettingsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourneySettingsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(TourneySettingsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
