import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EditCard } from './edit-card';

describe('EditCard', () => {
  let component: EditCard;
  let fixture: ComponentFixture<EditCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCard],
    })
      .overrideComponent(EditCard, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(EditCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onCloseClick when closeEditMenu is called', () => {
    const emitSpy = vi.spyOn(component.onCloseClick, 'emit');

    component.closeEditMenu();

    expect(emitSpy).toHaveBeenCalledOnce();
  });

  it('should emit selected mode when changeMode is called', () => {
    const emitSpy = vi.spyOn(component.onModeChange, 'emit');

    component.changeMode('tc');

    expect(emitSpy).toHaveBeenCalledWith('tc');
  });

  it('should emit onDeleteMap when deleteMap is called', () => {
    const emitSpy = vi.spyOn(component.onDeleteMap, 'emit');

    component.deleteMap();

    expect(emitSpy).toHaveBeenCalledOnce();
  });
});