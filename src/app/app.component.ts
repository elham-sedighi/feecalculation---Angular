import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {concatMap, switchMap} from "rxjs/operators";
import {concat, forkJoin, fromEvent, Observable, Subscription} from "rxjs";
import {Operation} from "./model/operation";
import * as moment from 'moment';
import {FeeConfig, feeConfigs} from "./model/feeConfig";
import {OperationType} from "./model/operationType";
import {UserType} from "./model/userType";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  title = 'Gini';
  subscriptions = new Subscription();
  calculateFeesClicks$: Observable<any>;
  userOperationRecords: Map<number, { week: number, amount: number }> =
    new Map<number, { week: number; amount: number }>();
  feeConfigs: feeConfigs = {cash_in: null, cash_out_natural: null, cash_out_juridical: null};
  _event;

  @ViewChild("calculateFessBtn",
    {read: ElementRef}) calculateFeesButton: ElementRef;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    forkJoin([
      this.getCashInFeeConfig(),
      this.getCashOutFeeConfigNatural(),
      this.getCashOutFeeConfigJuridical()
    ]).subscribe((configs: [FeeConfig, FeeConfig, FeeConfig]) => {
      this.feeConfigs.cash_in = configs[0];
      this.feeConfigs.cash_out_natural = configs[1];
      this.feeConfigs.cash_out_juridical = configs[2]
    })
    //this.subscriptions.add(fromEvent(this.calculateFeesButton.nativeElement, 'click'));
  }

  getCashInFeeConfig(): Observable<any> {
    return this.http.get('https://private-00d723-paysera.apiary-proxy.com/cash-in')
  }

  getCashOutFeeConfigNatural(): Observable<any> {
    return this.http.get('https://private-00d723-paysera.apiary-proxy.com/cash-out-natural')
  }

  getCashOutFeeConfigJuridical(): Observable<any> {
    return this.http.get('https://private-00d723-paysera.apiary-proxy.com/cash-out-juridical')
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  readInputFile(path: string): Observable<Operation[]> {
    console.log('start mapping input data to model...');
    return this.http.get<Operation[]>(path);
  }

  resetUserRecord(operation: Operation) {
    this.userOperationRecords.set(operation.user_id,
      {
        week: moment().week(),
        amount: 0
      })
  }

  formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  calculateFee(operation: Operation): number {
    let fee = 0;
    const oldRecord = this.userOperationRecords.get(operation.user_id);
    if (!oldRecord?.amount || !oldRecord?.week) {
      this.resetUserRecord(operation);
    }

    if (operation.type === OperationType.cash_in) {
      fee = parseFloat(this.formatter.format(
        (operation.operation.amount * this.feeConfigs.cash_in.percents) / 100));
      fee = fee > this.feeConfigs.cash_in.max.amount ?
        this.feeConfigs.cash_in.max.amount : fee;
    } else {
      if (operation.user_type == UserType.juridical) {
        fee = parseFloat(this.formatter.format((operation.operation.amount *
          this.feeConfigs.cash_out_juridical.percents) / 100));
        fee = fee < this.feeConfigs.cash_out_juridical.min.amount ?
          this.feeConfigs.cash_in.min.amount : fee;
      } else {
        let dd = moment(operation.date, 'YYYY-MM-DD').week();
        if (oldRecord.week === moment(operation.date, 'YYYY-MM-DD').week()) {
          const accumulatedAmount = oldRecord.amount + operation.operation.amount;
          fee = accumulatedAmount < this.feeConfigs.cash_out_natural.week_limit.amount ? 0 :
            parseFloat(this.formatter.format((operation.operation.amount *
              this.feeConfigs.cash_out_natural.percents) / 100));
        } else {
          this.resetUserRecord(operation);
          this.calculateFee(operation);
        }
      }
    }
    return fee;
  }

  ngAfterViewInit(): void {
    //listen to user clicks
    this._event = fromEvent(this.calculateFeesButton.nativeElement, 'click').pipe(
      //reset user click & fee calculation
      //debounceTime(1000),
      switchMap(() => {
        console.log('start reading data from input file...')
        return this.readInputFile('assets/input.json'); //('https://reqres.in/api/users?delay=5')
      }),

      //calculate fees sequentially
      concatMap(inputData => {
        console.log('start calculating fees...')
        return inputData.map(operation => {
          return this.calculateFee(operation);
        });
      })
    ).subscribe((fee: number) => {
      console.log(fee);
    });
  }
}
