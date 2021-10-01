import {createReducer, on} from '@ngrx/store';
import {FeeConfig} from "../model/feeConfig";
import {
  getFeeConfig, getFeeConfigSuccessful, setLocalFeeConfig, setLocalFeeConfigSuccessful
} from "../actions/feeConfig.actions";

export interface FeeConfigState {
  cashIn: FeeConfig,
  cashOutNatural: FeeConfig,
  cashOutJuridical: FeeConfig
}

export const initialState: FeeConfigState = {
  cashIn: null,
  cashOutNatural: null,
  cashOutJuridical: null
};

const _feeConfigReducer = createReducer(
  initialState,
  on(getFeeConfig, (state, {path, feeConfigType}) => ({
    ...state,
  })),
  on(getFeeConfigSuccessful, (state, {config, feeConfigType}) => ({
    ...state,
    [feeConfigType]: config
  })),
  on(setLocalFeeConfig, (state, {type}) => ({
    ...state,
  })),
  on(setLocalFeeConfigSuccessful, (state, {cashIn, cashOutNatural, cashOutJuridical}) => ({
    ...state,
    cashIn,
    cashOutNatural,
    cashOutJuridical
  })),
);

export function feeConfigReducer(state, action) {
  return _feeConfigReducer(state, action);
}
