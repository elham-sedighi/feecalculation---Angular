import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {filter, map} from "rxjs/operators";
import {combineLatest, fromEvent, Subscription} from "rxjs";
import {FeeConfigType} from './model/feeConfig';
import {config} from "./appConfig/appConfig";
import {Store} from "@ngrx/store";
import {AppState} from "./reducers";
import {readFile} from "./actions/file.actions";
import {getFeeConfig, getFeeConfigSuccessful, setLocalFeeConfig} from "./actions/feeConfig.actions";
import {Actions, ofType} from "@ngrx/effects";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, OnInit, AfterViewInit {
  title = 'Gini';
  subscriptions = new Subscription();
  @ViewChild('calculateFeesBtn', {read: ElementRef}) calculateFeesButton: ElementRef;
  disabled = true;

  constructor(private store: Store<AppState>,
              private actions$: Actions) {
  }

  ngOnInit() {
    [
      getFeeConfig({path: config.cashInFeeConfigURL, feeConfigType: FeeConfigType.cashIn}),
      getFeeConfig({path: config.cashOutNaturalFeeConfigURL, feeConfigType: FeeConfigType.cashOutNatural}),
      getFeeConfig({path: config.cashOutJuridicalFeeConfigURL, feeConfigType: FeeConfigType.cashOutJuridical})
    ].forEach(action => this.store.dispatch(action));

    combineLatest([
      this.actions$.pipe(ofType(getFeeConfigSuccessful),
        filter(({feeConfigType}) => feeConfigType === FeeConfigType.cashIn)),
      this.actions$.pipe(ofType(getFeeConfigSuccessful),
        filter(({feeConfigType}) => feeConfigType === FeeConfigType.cashOutNatural)),
      this.actions$.pipe(ofType(getFeeConfigSuccessful),
        filter(({feeConfigType}) => feeConfigType === FeeConfigType.cashOutJuridical))
    ]).subscribe(res => {
      console.log('Fee configs was set from API!')
      this.disabled = false;
    }, error => {
      console.log(`Failed to get fee config data from API!_${error}`);
      this.store.dispatch(setLocalFeeConfig());
      this.disabled = false;
    })
  }

  ngAfterViewInit(): void {
    //listen to user clicks
    this.subscriptions.add(fromEvent(this.calculateFeesButton.nativeElement, 'click').pipe(
      //reset user click & fee calculation
      //debounceTime(1000),
      map(() => {
        console.log('start reading data from input file...')
        this.store.dispatch(readFile({path: config.inputFilePath}))
      })).subscribe());
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
