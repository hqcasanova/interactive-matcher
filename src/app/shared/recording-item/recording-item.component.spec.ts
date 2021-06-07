import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingItemComponent } from './recording-item.component';

describe('RecordingItemComponent', () => {
  let component: RecordingItemComponent;
  let fixture: ComponentFixture<RecordingItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
