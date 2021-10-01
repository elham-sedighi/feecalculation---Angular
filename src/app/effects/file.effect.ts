import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Injectable} from "@angular/core";
import {map, switchMap} from "rxjs/operators";
import {FileService} from "../service/file/file.service";
import {readFile, readFileSuccessful} from "../actions/file.actions";
import {Observable} from "rxjs";
import {Action} from "@ngrx/store";
import {calculateFee} from "../actions/fee.actions";
import * as moment from 'moment';

@Injectable()
export class FileEffect {
  constructor(private actions$: Actions,
              private fileReader: FileService,) {
  }

  readFile$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(readFile),
      switchMap(data => {
        return this.fileReader.readInputFile(data.path).pipe(
          map((operations) => {
            operations = operations.map(operation => {
              operation.weekNumber = moment(operation.date, '').week()
              return operation;
            })
            return readFileSuccessful({operations})
          })
        )
      })
    )
  )

  readFileSuccessful$: Observable<Action> = createEffect(() =>
    this.actions$.pipe(
      ofType(readFileSuccessful),
      switchMap(data => {
        return data.operations.map(operation => {
          return calculateFee({operation})
        })
      })
    )
  )
}
