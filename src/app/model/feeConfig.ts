import {OperationDetail} from "./operationDetail";

export interface FeeConfig {
  percents: number,
  week_limit?: OperationDetail
  min?: OperationDetail,
  max?: OperationDetail
}

export enum FeeConfigType {
  cashIn = 'cashIn',
  cashOutNatural = 'cashOutNatural',
  cashOutJuridical = 'cashOutJuridical'
}
