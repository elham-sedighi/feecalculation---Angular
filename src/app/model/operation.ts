import {UserType} from "./userType";
import {OperationType} from "./operationType";
import {OperationDetail} from "./operationDetail";
import * as moment from 'moment';

export interface Operation {
  date: moment.Moment, // operation date in format `Y-m-d`
  user_id: number,
  user_type: UserType,
  type: OperationType,
  operation: OperationDetail
}
