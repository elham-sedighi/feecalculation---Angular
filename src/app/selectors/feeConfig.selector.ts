import {createFeatureSelector, createSelector} from "@ngrx/store";
import {FeeConfigState} from "../reducers/feeConfig.reducer";

export const getFeeConfigState = createFeatureSelector<FeeConfigState>(
  'feeConfigsState',
)

export const getFeeConfigs = createSelector(
  getFeeConfigState, (state: FeeConfigState) => state
)

export const getCashInFeeConfig = createSelector(
  getFeeConfigState, (state: FeeConfigState) => state.cashIn
)

export const getCashOutNaturalFeeConfig = createSelector(
  getFeeConfigState, (state: FeeConfigState) => state.cashOutNatural
)

export const getCashOutJuridicalFeeConfig = createSelector(
  getFeeConfigState, (state: FeeConfigState) => state.cashOutJuridical
)
