import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentatorBox } from './commentator-box';

describe('CommentatorBox', () => {
  let component: CommentatorBox;
  let fixture: ComponentFixture<CommentatorBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommentatorBox],
    }).compileComponents();

    fixture = TestBed.createComponent(CommentatorBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
