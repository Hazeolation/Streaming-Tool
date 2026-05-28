import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreBox } from './score-box';

describe('ScoreBox', () => {
  let component: ScoreBox;
  let fixture: ComponentFixture<ScoreBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreBox],
    }).compileComponents();

    fixture = TestBed.createComponent(ScoreBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
