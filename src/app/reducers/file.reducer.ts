import {createReducer, on} from '@ngrx/store';
import {Operation} from "../model/operation";
import {readFile, readFileSuccessful} from "../actions/file.actions";

export interface FileState {
  inputData: Operation[]
}

export const initialState: FileState = {
  inputData: []
};

const _fileReducer = createReducer(
  initialState,
  on(readFile, (state, {path}) => ({
    ...state,
  })),
  on(readFileSuccessful, (state, {operations}) => ({
    ...state,
    inputData: operations
  }))
);

export function fileReducer(state, action) {
  return _fileReducer(state, action);
}
