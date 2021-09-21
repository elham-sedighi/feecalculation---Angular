import {OperationDetail} from "./operationDetail";

export interface FeeConfig {
  percents: number,
  max?: OperationDetail,
  min?: OperationDetail,
  week_limit?: OperationDetail
}

export interface feeConfigs {
  cash_out_natural: FeeConfig,
  cash_out_juridical: FeeConfig,
  cash_in: FeeConfig
}
