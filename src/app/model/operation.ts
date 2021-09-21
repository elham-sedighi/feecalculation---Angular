import {UserType} from "./userType";
import {OperationType} from "./operationType";
import {OperationDetail} from "./operationDetail";

export interface Operation {
  date: Date, // operation date in format `Y-m-d`
  user_id: number,
  user_type: UserType,
  type: OperationType,
  operation: OperationDetail
}
