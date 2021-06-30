import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { first } from 'rxjs/operators';

import { SearchFieldComponent } from './search-field.component';

describe('SearchFieldComponent', () => {
  let component: SearchFieldComponent;
  let fixture: ComponentFixture<SearchFieldComponent>;
  let compiled: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatInputModule, BrowserAnimationsModule],
      declarations: [ SearchFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFieldComponent);
    component = fixture.componentInstance;
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it(`should render the placeholder as label text`, () => {
    fixture.detectChanges();
    const labelDe = fixture.debugElement.query(By.css('label'));

    component.placeholder = 'placeholder';
    fixture.detectChanges();
    expect(labelDe.nativeElement.textContent).toEqual('placeholder');
  });


  it(`should render the query as input text`, () => {
    fixture.detectChanges();
    const inputDe = fixture.debugElement.query(By.css('input[type=search]'));
    
    component.query = '   query   ';
    fixture.detectChanges();
    expect(inputDe.nativeElement.value).toEqual(component.query);
  });


  it(`should emit trimmed query on clicking search button`, () => {
    fixture.detectChanges();
    const buttonEl = fixture.debugElement.query(By.css('button'));
    const inputDe = fixture.debugElement.query(By.css('input[type=search]'));
    let query: string | undefined;

    inputDe.nativeElement.value = '   query   ';
    component.lookup.pipe(first()).subscribe(text => query = text);
    buttonEl.triggerEventHandler('click', null);
    expect(query).toBe('query');
  })  
});
