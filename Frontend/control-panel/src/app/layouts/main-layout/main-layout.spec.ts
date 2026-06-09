import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterOutlet, provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MainLayout } from './main-layout';
import { BroadcastStateService } from '../../services/broadcast-state';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: '',
})
class MockSidebar {}

@Component({
  selector: 'app-topbar',
  standalone: true,
  template: '',
})
class MockTopbar {}

describe('MainLayout', () => {
  let component: MainLayout;
  let fixture: ComponentFixture<MainLayout>;

  const mockStateService = {
    loadInitialState: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [MainLayout],
      providers: [
        provideRouter([]),
        {
          provide: BroadcastStateService,
          useValue: mockStateService,
        },
      ],
    })
      .overrideComponent(MainLayout, {
        set: {
          imports: [MockSidebar, MockTopbar, RouterOutlet],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadInitialState on init', () => {
    expect(mockStateService.loadInitialState).toHaveBeenCalledOnce();
  });
});