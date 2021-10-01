import {createAction, props} from "@ngrx/store";
import {FeeConfig, FeeConfigType} from "../model/feeConfig";

export const getFeeConfig = createAction(
  '[Config] Get Fee Config',
  props<{ path: string, feeConfigType: FeeConfigType }>()
);

export const getFeeConfigSuccessful = createAction(
  '[Config] Get Fee Config Successful',
  props<{ config: FeeConfig, feeConfigType: FeeConfigType }>()
);

export const setLocalFeeConfig = createAction(
  '[Config] Set Local Fee Config'
);

export const setLocalFeeConfigSuccessful = createAction(
  '[Config] Set Local Fee Config Successful',
  props<{ cashIn: FeeConfig, cashOutNatural: FeeConfig, cashOutJuridical: FeeConfig }>()
);
