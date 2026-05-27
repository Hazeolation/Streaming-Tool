import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Scoreboard } from './scoreboard';

describe('Scoreboard', () => {
  let component: Scoreboard;
  let fixture: ComponentFixture<Scoreboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Scoreboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Scoreboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
