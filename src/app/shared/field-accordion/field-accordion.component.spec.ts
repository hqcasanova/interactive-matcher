import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldAccordionComponent } from './field-accordion.component';

describe('FieldAccordionComponent', () => {
  let component: FieldAccordionComponent;
  let fixture: ComponentFixture<FieldAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
