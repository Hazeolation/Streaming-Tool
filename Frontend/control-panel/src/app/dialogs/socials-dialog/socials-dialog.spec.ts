import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialsDialog } from './socials-dialog';

describe('SocialsDialog', () => {
  let component: SocialsDialog;
  let fixture: ComponentFixture<SocialsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialsDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialsDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
