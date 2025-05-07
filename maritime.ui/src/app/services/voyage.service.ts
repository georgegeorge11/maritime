import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HelperService} from '../utils/helper.service';
import {Observable} from 'rxjs';
import {Voyage} from '../models/voyage.model';
import {catchError, tap} from 'rxjs/operators';
import {Port} from '../models/port.model';

@Injectable({
  providedIn: 'root'
})
export class VoyageService {
  apiURL: string = environment.apiURL;
  http=inject(HttpClient);
  helper = inject(HelperService)
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor() { }

  getVoyages(): Observable<Voyage[]> {
    return this.http.get<Voyage[]>(this.apiURL + 'Voyage/get-voyages')
      .pipe(
        tap(() => console.log('Fetched voyages')),
        catchError(this.helper.handleError<Voyage[]>('getVoyages', []))
      );
  }
  addVoyage(voyage: Voyage): Observable<Voyage> {
    return this.http.post<Voyage>(this.apiURL+'Voyage/add-voyage', voyage, this.httpOptions).pipe(
      tap((voyage: Voyage) => console.log(`Added voyage w/ id=${voyage.voyagePK}`)),
      catchError(this.helper.handleError<Voyage>('createVoyage'))
    );
  }

  updateVoyage(voyagePK: number, voyage:Voyage): Observable<Voyage> {
    return this.http.put<Voyage>(this.apiURL+`Voyage/update-voyage/${voyagePK}`, voyage, this.httpOptions).pipe(
      tap(_ => console.log(`Updated voyage id=${voyagePK}`)),
      catchError(this.helper.handleError<any>('updateVoyage'))
    );
  }

  deleteVoyage(id: number): Observable<Voyage> {
    return this.http.delete<Voyage>(this.apiURL+`Voyage/delete-voyage/${id}`, this.httpOptions).pipe(
      tap(_ => console.log(`Deleted voyage id=${id}`)),
      catchError(this.helper.handleError<Voyage>('deleteVoyage'))
    );
  }
}
