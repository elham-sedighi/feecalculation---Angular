import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {feeReducer, FeesState} from "./fee.reducer";
import {fileReducer, FileState} from "./file.reducer";
import {feeConfigReducer, FeeConfigState} from "./feeConfig.reducer";


export interface AppState {
  feesState: FeesState,
  fileState: FileState,
  feeConfigsState: FeeConfigState
}

export const reducers: ActionReducerMap<AppState> = {
  feesState: feeReducer,
  fileState: fileReducer,
  feeConfigsState: feeConfigReducer
};

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
