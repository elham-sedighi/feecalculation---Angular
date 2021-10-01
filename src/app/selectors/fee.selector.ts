import {createFeatureSelector, createSelector} from "@ngrx/store";
import {config} from "../appConfig/appConfig";
import {FeesState} from "../reducers/fee.reducer";

export const getFeeState = createFeatureSelector<FeesState>(
  'FeesState',
)

export const getFees = createSelector(
  getFeeState, (state: FeesState) => {
    state.fees.map(fee =>
      config.currencyFormatter.format(fee)
    )
  }
)
