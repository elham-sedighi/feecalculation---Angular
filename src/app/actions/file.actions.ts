import {createAction, props} from "@ngrx/store";
import {Operation} from "../model/operation";

export const readFile = createAction(
  '[File] read',
  props<{ path: string }>()
);

export const readFileSuccessful = createAction(
  '[File] read successful',
  props<{ operations: Operation[] }>()
);
