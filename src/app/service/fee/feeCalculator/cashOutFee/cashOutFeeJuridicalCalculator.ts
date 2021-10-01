import {FeeConfig} from "../../../../model/feeConfig";
import {ConfigAble} from "../configable";

export default class CashOutFeeJuridicalCalculator implements ConfigAble{
  feeConfig: FeeConfig;

  constructor(feeConfig) {
    this.feeConfig = feeConfig;
  }

  calculate(operation) {
    let fee = (operation.operation.amount * this.feeConfig.percents) / 100;
    fee = fee < this.feeConfig.min.amount ? this.feeConfig.min.amount : fee;
    return fee;
  }
}
