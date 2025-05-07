import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HelperService} from '../utils/helper.service';
import {Observable} from 'rxjs';
import {Port} from '../models/port.model';
import {catchError, tap} from 'rxjs/operators';
import {Ship} from '../models/ship.model';

@Injectable({
  providedIn: 'root'
})
export class ShipService {
  apiURL: string = environment.apiURL;
  http=inject(HttpClient);
  helper = inject(HelperService)
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor() { }

  getShips(): Observable<Ship[]> {
    return this.http.get<Ship[]>(this.apiURL+ 'Ship/get-ships')
      .pipe(
        tap(() => console.log('Fetched ports')),
        catchError(this.helper.handleError<Ship[]>('getShips', []))
      );
  }

  addShip(newShip: Ship): Observable<Ship> {
    return this.http.post<Ship>(this.apiURL+'Ship/add-ship', newShip, this.httpOptions).pipe(
      tap((newShip: Ship) => console.log(`Added port w/ id=${newShip.shipPK}`)),
      catchError(this.helper.handleError<Ship>('createShip'))
    );
  }

  updateShip(id: number, ship: Ship): Observable<Ship> {

    return this.http.put<Ship>(this.apiURL+`Ship/update-ship/${id}`, ship, this.httpOptions).pipe(
      tap(_ => console.log(`Updated ship id=${id}`)),
      catchError(this.helper.handleError<any>('updateShip'))
    );
  }

  deleteShip(id: number): Observable<Ship> {
    return this.http.delete<Ship>(this.apiURL+`Ship/delete-ship/${id}`, this.httpOptions).pipe(
      tap(_ => console.log(`Deleted ship id=${id}`)),
      catchError(this.helper.handleError<Ship>('deleteShip'))
    );
  }
}
