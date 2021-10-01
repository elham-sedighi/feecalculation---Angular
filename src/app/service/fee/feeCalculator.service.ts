import {Injectable} from '@angular/core';
import CashInFeeCalculator from "./feeCalculator/cashInFeeCalculator";
import {OperationType} from "../../model/operationType";
import {UserType} from "../../model/userType";
import CashOutFeeNaturalCalculator from "./feeCalculator/cashOutFee/cashOutFeeNaturalCalculator";
import CashOutFeeJuridicalCalculator from "./feeCalculator/cashOutFee/cashOutFeeJuridicalCalculator";
import {ConfigAble} from "./feeCalculator/configable";
import {select, Store} from "@ngrx/store";
import {getFeeConfigs} from "../../selectors/feeConfig.selector";
import {FeeConfigState} from "../../reducers/feeConfig.reducer";

@Injectable({
  providedIn: 'root'
})
export class FeeCalculatorService {

  feeCalculators: Map<string, ConfigAble> =
    new Map<string, ConfigAble>();
  feeConfigs: FeeConfigState;

  constructor(private store: Store) {
    this.store.select(getFeeConfigs).subscribe(configs => {
      this.feeConfigs = configs;
    })
  }

  getFeeCalculatorInstance(usertype, operationType) {
    let feeCalculator;
    switch (operationType) {
      case OperationType.cash_out:
        feeCalculator = this.feeCalculators.get(`${operationType}_${usertype}`);
        break;
      default:
        feeCalculator = this.feeCalculators.get(operationType);
        break;
    }
    if (feeCalculator) return feeCalculator;

    switch (operationType) {
      case OperationType.cash_out:
        switch (usertype) {
          case UserType.natural:
            feeCalculator = new CashOutFeeNaturalCalculator(this.feeConfigs.cashOutNatural);
            break;
          default:
            feeCalculator = new CashOutFeeJuridicalCalculator(this.feeConfigs.cashOutJuridical);
        }
        this.feeCalculators.set(`${operationType}_${usertype}`, feeCalculator);
        return feeCalculator;
      default:
        feeCalculator = new CashInFeeCalculator(this.feeConfigs.cashIn);
        this.feeCalculators.set(operationType, feeCalculator);
        return feeCalculator;
    }
  }
}
