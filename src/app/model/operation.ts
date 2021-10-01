import {UserType} from "./userType";
import {OperationType} from "./operationType";
import {OperationDetail} from "./operationDetail";

export interface Operation {
  weekNumber?: number,
  user_id: number,
  user_type: UserType,
  type: OperationType,
  operation: OperationDetail,
  date : string
}
