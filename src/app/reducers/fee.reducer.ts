import {createReducer, on} from '@ngrx/store';
import {calculateFee, feeCalculateSuccessful, resetFee} from "../actions/fee.actions";

export interface FeesState {
  fees: string[]
}

export const initialState: FeesState = {
  fees: []
};

const _feeReducer = createReducer(
  initialState,
  on(calculateFee, (state, {operation}) => ({
    ...state,
  })),
  on(feeCalculateSuccessful, (state, {fee}) => ({
    ...state,
    fees: [...state.fees, fee]
  })),
  on(resetFee, (state) => ({
    ...state,
  })),
);

export function feeReducer(state, action) {
  return _feeReducer(state, action);
}
