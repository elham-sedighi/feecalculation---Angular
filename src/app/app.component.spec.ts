import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Operation} from "./model/operation";
import {OperationType} from "./model/operationType";
import {UserType} from "./model/userType";
import * as moment from 'moment';
import {HttpClientModule} from "@angular/common/http";

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [HttpClientModule]
    }).compileComponents();
  });

  it('should create the app', () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Gini'`, () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    expect(app.title).toEqual('Gini');
  });

  it('should render title', () => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('Gini app is running!');
  });


    it('should calculate cash_in fee', function () {
      fixture = TestBed.createComponent(AppComponent);
      app = fixture.componentInstance;
      const operation: Operation = {
        type: OperationType.cash_in,
        user_type: UserType.juridical,
        user_id: 2,
        date: moment("2016-01-10", 'YYYY-MM-DD'),
        operation: {
          amount: 1000000.00,
          currency: "EUR"
        }
      }
      let result = fixture.componentInstance.calculateFee(operation)
      expect(result).toBe(5.00);
    });
});
