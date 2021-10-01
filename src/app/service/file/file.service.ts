import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Operation} from "../../model/operation";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) {
  }

  readInputFile(path: string): Observable<Operation[]> {
    console.log('start mapping input data to model...');
    return this.http.get<Operation[]>(path);
  }
}
