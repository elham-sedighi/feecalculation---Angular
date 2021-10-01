import {FeeConfig} from "../../../../model/feeConfig";
import {ConfigAble} from "../configable";

export default class CashOutFeeNaturalCalculator implements ConfigAble{

  cashOutNaturalOperationRecords: Map<string, { weekNumber: number, amount: number }> =
    new Map<string, { weekNumber: number; amount: number }>();
  feeConfig: FeeConfig;

  constructor(feeConfig: FeeConfig) {
    this.feeConfig = feeConfig;
  }

  calculate(operation) {
    const existedAmount = this.getExistedAmount(operation.user_id, operation.weekNumber);
    const newAmount = operation.operation.amount;
    let fee = 0;
    const allAmounts = existedAmount + newAmount;
    if (allAmounts >= this.feeConfig.week_limit.amount) {
      const effectiveAmount = newAmount - this.calculateExceededAmount(existedAmount);
      fee = effectiveAmount * this.feeConfig.percents * 0.01;
    }
    this.addOprToMap(operation);
    return fee;
  }

  // returns total cashed out amounts for each user in recent week
  getExistedAmount(userId, weekNumber) {
    const oldRecord = this.cashOutNaturalOperationRecords.get(userId);
    if (!oldRecord) {
      return 0;
    }
    if (oldRecord.weekNumber === weekNumber) {
      return oldRecord.amount;
    }
    return 0;
  }

  // calculates exceeded amount to apply the commission
  calculateExceededAmount(existedAmount) {
    if (existedAmount - this.feeConfig.week_limit.amount > 0) {
      return 0;
    }
    return this.feeConfig.week_limit.amount - existedAmount;
  }

  // records the cashed out operations in a map
  addOprToMap(operation) {
    const oldRecord = this.cashOutNaturalOperationRecords.get(operation.user_id);
    const {weekNumber} = operation;
    if (!oldRecord) {
      this.cashOutNaturalOperationRecords.set(operation.user_id,
        {weekNumber, amount: operation.operation.amount});
    } else if (oldRecord.weekNumber === weekNumber) {
      oldRecord.amount += operation.operation.amount;
    } else {
      this.cashOutNaturalOperationRecords.set(operation.user_id,
        {weekNumber, amount: operation.operation.amount});
    }
  }
}
