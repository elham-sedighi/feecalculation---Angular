import {createAction, props} from "@ngrx/store";
import {Operation} from "../model/operation";

export const calculateFee = createAction(
  '[Fee] Calculate',
  props<{ operation: Operation }>()
);

export const feeCalculateSuccessful = createAction(
  '[Fee] Calculate Successful',
  props<{ fee: string }>()
);

export const resetFee = createAction(
  '[Fee] Reset'
);
