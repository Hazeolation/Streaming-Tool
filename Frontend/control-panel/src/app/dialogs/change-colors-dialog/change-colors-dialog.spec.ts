import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeColorsDialog } from './change-colors-dialog';

describe('ChangeColorsDialog', () => {
  let component: ChangeColorsDialog;
  let fixture: ComponentFixture<ChangeColorsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeColorsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeColorsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
