import {Actions, createEffect, ofType} from "@ngrx/effects";
import {calculateFee, feeCalculateSuccessful} from "../actions/fee.actions";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {FeeCalculatorService} from "../service/fee/feeCalculator.service";
import {config} from "../appConfig/appConfig";

@Injectable()
export class FeeEffect {
  constructor(private actions$: Actions,
              private feeCalculator: FeeCalculatorService) {
  }

  calculateFee$ = createEffect(() =>
    this.actions$.pipe(
      ofType(calculateFee),
      map(data => {
        const opr = data.operation;
        const calculator = this.feeCalculator.getFeeCalculatorInstance(opr.user_type, opr.type);
        const fee = calculator.calculate(opr);
        console.log(config.currencyFormatter.format(fee));
        return feeCalculateSuccessful({fee: config.currencyFormatter.format(fee)})
      })
    )
  )
}
