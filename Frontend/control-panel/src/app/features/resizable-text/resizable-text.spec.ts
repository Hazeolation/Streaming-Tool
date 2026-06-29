import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ResizableText } from './resizable-text';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ResizableText', () => {
  let component: ResizableText;
  let fixture: ComponentFixture<ResizableText>;

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [ResizableText],
      providers: [],
    });

    fixture = TestBed.createComponent(ResizableText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should have default aspectRatio', () => {
    expect(component.aspectRatioContent).toBe('xMinYMid meet');
  });

  it('should set aspectRatio', () => {
    fixture.componentRef.setInput('aspectRatio', 'xMaxYMid meet');
    expect(component.aspectRatioContent).toBe('xMaxYMid meet');
  });

  it('should set text content', () => {
    fixture.componentRef.setInput('resizableTextContent', 'test 1234');
    expect(component.textContent).toBe('test 1234');
  });
});
