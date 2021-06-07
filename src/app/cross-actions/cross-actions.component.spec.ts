import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossActionsComponent } from './cross-actions.component';

describe('CrossActionsComponent', () => {
  let component: CrossActionsComponent;
  let fixture: ComponentFixture<CrossActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossActionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
