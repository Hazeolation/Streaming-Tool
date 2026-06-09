import { TestBed } from '@angular/core/testing';
import { describe, beforeEach, it, expect } from 'vitest'
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
  
  it('should have signal reachable', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect((app as any).title()).toBe('control-panel');
  });
});
