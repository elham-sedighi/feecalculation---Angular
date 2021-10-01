import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private http: HttpClient) {
  }

  getFeeConfig(path: string): Observable<any> {
    return this.http.get(path)
  }
}
