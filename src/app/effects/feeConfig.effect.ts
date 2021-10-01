import {Actions, createEffect, ofType} from "@ngrx/effects";
import {calculateFee, feeCalculateSuccessful} from "../actions/fee.actions";
import {Injectable} from "@angular/core";
import {map, mergeMap, switchMap} from "rxjs/operators";
import {
  getFeeConfig,
  getFeeConfigSuccessful, setLocalFeeConfig, setLocalFeeConfigSuccessful
} from "../actions/feeConfig.actions";
import {ConfigService} from "../service/config/config.service";
import {config} from "../appConfig/appConfig";

@Injectable()
export class FeeConfigEffect {
  constructor(private actions$: Actions,
              private feeConfigService: ConfigService) {
  }

  getFeeConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getFeeConfig),
      mergeMap((data) => {
        return this.feeConfigService.getFeeConfig(data.path).pipe(
          map(config => {
            return getFeeConfigSuccessful({config, feeConfigType: data.feeConfigType})
          })
        )
      })
    )
  )

  setLocalFeeConfig$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setLocalFeeConfig),
      map(() => {
        setLocalFeeConfigSuccessful(
          {
            cashIn: {
              percents: 0.03,
              max: {
                amount: 5,
                currency: config.currency,
              }
            },
            cashOutNatural: {
              percents: 0.3,
              week_limit: {
                amount: 1000,
                currency: config.currency,
              }
            },
            cashOutJuridical: {
              percents: 0.3,
              min: {
                amount: 0.5,
                currency: config.currency,
              }
            }
          }
        )
      })
    ), {dispatch: false}
  )

  setLocalFeeConfigSuccessful$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setLocalFeeConfigSuccessful),
      map(() => {
        console.log('Fee configs was set from local data!');
      })
    ), {dispatch: false}
  )
}
