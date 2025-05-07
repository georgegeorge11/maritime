import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`, error);
      if (error.status === 400) {
        alert(`Operation ${operation} failed: ${error.error}`); // Show backend message
      }
      return of(result as T);
    };
  }
}
