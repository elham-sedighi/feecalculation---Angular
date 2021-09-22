import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {concatMap, switchMap} from "rxjs/operators";
import {forkJoin, fromEvent, Observable, Subscription} from "rxjs";
import {Operation} from './model/operation';
import * as moment from 'moment';

moment.updateLocale('en', {
  week: {
    dow: 1
  }
})
import {FeeConfig, feeConfigs} from './model/feeConfig';
import {OperationType} from './model/operationType';
import {UserType} from './model/userType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  title = 'Gini';
  subscriptions = new Subscription();
  userOperationRecords: Map<number, { date: moment.Moment, amount: number }> =
    new Map<number, { date: moment.Moment, amount: number }>();
  feeConfigs: feeConfigs = {cash_in: null, cash_out_natural: null, cash_out_juridical: null};

  @ViewChild('calculateFeesBtn', {read: ElementRef}) calculateFeesButton: ElementRef;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.subscriptions.add(forkJoin([
      this.getCashInFeeConfig(),
      this.getCashOutFeeConfigNatural(),
      this.getCashOutFeeConfigJuridical()])
      .subscribe((configs: [FeeConfig, FeeConfig, FeeConfig]) => {
        [this.feeConfigs.cash_in, this.feeConfigs.cash_out_natural, this.feeConfigs.cash_out_juridical] = configs;
      })
    )
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

  readInputFile(path: string): Observable<Operation[]> {
    console.log('start mapping input data to model...');
    return this.http.get<Operation[]>(path);
  }

  /*setUserRecord(operation: Operation) {
    const previous_amount = !!this.userOperationRecords.get(operation.user_id)?.amount ?
      this.userOperationRecords.get(operation.user_id)?.amount : 0;
    this.userOperationRecords.set(operation.user_id, {
      date: moment(operation.date, 'YYYY-MM-DD'),
      week: moment(operation.date, 'YYYY-MM-DD').week(),
      amount: previous_amount + operation.operation.amount
    })
  }*/

  formatter = new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

  calculateFee(opr: Operation): number {
    if (opr.type === OperationType.cash_in) {
      return this.calculateCashInFee(opr.operation.amount);
    }
    return this.calculateCashOutFee(opr);
  }

  calculateCashInFee(amount: number) {
    let fee = parseFloat(this.formatter.format((amount * this.feeConfigs.cash_in.percents) / 100));
    fee = fee > this.feeConfigs.cash_in.max.amount ? this.feeConfigs.cash_in.max.amount : fee;
    return fee;
  }

  calculateCashOutFee(opr: Operation) {
    if (opr.user_type == UserType.juridical) {
      return this.calculateCashOutJuridicalFee(opr);
    }
    return this.calculateCashOutNatural(opr);
  }

  calculateCashOutJuridicalFee(opr: Operation) {
    let fee = parseFloat(this.formatter.format((opr.operation.amount * this.feeConfigs.cash_out_juridical.percents) / 100));
    fee = fee < this.feeConfigs.cash_out_juridical.min.amount ? this.feeConfigs.cash_in.min.amount : fee;
    return fee;
  }

  calculateCashOutNatural(opr: Operation) {
    const existedAmount = this.getExistedAmount(opr.user_id, moment(opr.date, 'YYYY-MM-DD'));
    let fee = this.calculateCashOutNaturalFee(existedAmount, opr.operation.amount);
    this.addOprToMap(opr);
    return fee;
  }

  getExistedAmount(userId: number, date: moment.Moment) {
    let oldRecord = this.userOperationRecords.get(userId);
    if (!oldRecord) {
      return 0;
    }
    if (oldRecord.date.week() === date.week()) {
      return oldRecord.amount;
    }
    return 0;
  }

  calculateCashOutNaturalFee(existedAmount: number, newAmount: number) {
    let fee = 0;
    const allAmounts = existedAmount + newAmount;
    if (allAmounts > this.feeConfigs.cash_out_natural.week_limit.amount) {
      const effectiveAmount = newAmount - this.calculateExceededAmount(existedAmount);
      fee = parseFloat(this.formatter.format(effectiveAmount *
        this.feeConfigs.cash_out_natural.percents * 0.01));
    }
    return fee;
  }

  calculateExceededAmount(existedAmount: number): number {
    if (existedAmount - this.feeConfigs.cash_out_natural.week_limit.amount > 0) {
      return 0;
    }
    return this.feeConfigs.cash_out_natural.week_limit.amount - existedAmount;
  }

  addOprToMap(opr: Operation) {
    let oldRecord = this.userOperationRecords.get(opr.user_id);
    const opr_Date = moment(opr.date, 'YYYY-MM-DD');
    if (!oldRecord) {
      this.userOperationRecords.set(opr.user_id, {date: opr_Date, amount: opr.operation.amount});
    } else {
      if (oldRecord.date.week() === opr_Date.week()) {
        oldRecord.amount = oldRecord.amount + opr.operation.amount;
      } else {
        this.userOperationRecords.set(opr.user_id, {date: opr_Date, amount: opr.operation.amount});
      }
    }
  }


  /*calculateFee(operation: Operation): number {
    let fee = 0;
    if (operation.type === OperationType.cash_in) {
      fee = parseFloat(this.formatter.format((operation.operation.amount * this.feeConfigs.cash_in.percents) / 100));
      fee = fee > this.feeConfigs.cash_in.max.amount ? this.feeConfigs.cash_in.max.amount : fee;
    } else {
      if (operation.user_type == UserType.juridical) {
        fee = parseFloat(this.formatter.format((operation.operation.amount * this.feeConfigs.cash_out_juridical.percents) / 100));
        fee = fee < this.feeConfigs.cash_out_juridical.min.amount ? this.feeConfigs.cash_in.min.amount : fee;
      } else {
        let oldRecord = this.userOperationRecords.get(operation.user_id);
        if (!oldRecord?.amount || !oldRecord?.week) {
          this.setUserRecord(operation);
        }
        oldRecord = this.userOperationRecords.get(operation.user_id);
        if (oldRecord.week === moment(operation.date, 'YYYY-MM-DD').week()
          && oldRecord.date !== moment(operation.date, 'YYYY-MM-DD')) {
          const accumulatedAmount = oldRecord.amount + operation.operation.amount;
          fee = accumulatedAmount < this.feeConfigs.cash_out_natural.week_limit.amount ? 0 : parseFloat(this.formatter.format((operation.operation.amount * this.feeConfigs.cash_out_natural.percents) / 100));
          this.setUserRecord(operation);
        } else {
          this.setUserRecord(operation);
          this.calculateFee(operation);
        }
      }
    }
    return fee;
  }*/

  ngAfterViewInit(): void {
    //listen to user clicks
    this.subscriptions.add(fromEvent(this.calculateFeesButton.nativeElement, 'click').pipe(
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
          console.log(this.calculateFee(operation));
          return true;
        });
      })
    ).subscribe((fee: boolean) => {
      console.log(fee);
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
