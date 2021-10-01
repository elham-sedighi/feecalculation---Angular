import {createFeatureSelector, createSelector} from "@ngrx/store";
import {FileState} from "../reducers/file.reducer";

export const getFileState = createFeatureSelector<FileState>(
  'FileState',
)

export const getInputData = createSelector(
  getFileState, (state: FileState) => state.inputData
)
