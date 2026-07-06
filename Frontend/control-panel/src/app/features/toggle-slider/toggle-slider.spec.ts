import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ToggleSlider } from './toggle-slider';
import { LogService } from '../../services/log';

describe('ToggleSlider', () => {
  let component: ToggleSlider;
  let fixture: ComponentFixture<ToggleSlider>;

  const mockLogService = {
    beginScope: vi.fn().mockReturnValue({
      dispose: vi.fn(),
    }),
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    critical: vi.fn(),
  };

  beforeEach(async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [ToggleSlider],
      providers: [
        {
          provide: LogService,
          useValue: mockLogService,
        },
      ],
    })
      .overrideComponent(ToggleSlider, {
        set: {
          template: '',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ToggleSlider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onToggleSliderClick when handleToggleSliderClick is called', () => {
    const emitSpy = vi.spyOn(component.onToggleSliderClick, 'emit');

    component.handleToggleSliderClick();

    expect(emitSpy).toHaveBeenCalledOnce();
  });
});
