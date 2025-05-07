import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable} from 'rxjs';
import {Port} from '../models/port.model';
import {HelperService} from '../utils/helper.service';
import { catchError, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class PortService {

  apiURL: string = environment.apiURL;
  http=inject(HttpClient);
  helper = inject(HelperService)
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor() { }
  getPorts(): Observable<Port[]> {
    return this.http.get<Port[]>(this.apiURL+ 'Port/get-ports')
      .pipe(
        tap(() => console.log('Fetched ports')),
        catchError(this.helper.handleError<Port[]>('getPorts', []))
      );
  }

  addPort(newPort: Port): Observable<Port> {
    return this.http.post<Port>(this.apiURL+'Port/add-port', newPort, this.httpOptions).pipe(
      tap((newPort: Port) => console.log(`Added port w/ id=${newPort.portPK}`)),
      catchError(this.helper.handleError<Port>('createPort'))
    );
  }

  updatePort(id: number, port: Port): Observable<Port> {
    console.log(id, port)
    return this.http.put<Port>(this.apiURL+`Port/update-port/${id}`, port, this.httpOptions).pipe(
      tap(_ => console.log(`Updated port id=${id}`)),
      catchError(this.helper.handleError<any>('updatePort'))
    );
  }

  deletePort(id: number): Observable<Port> {
    return this.http.delete<Port>(this.apiURL+`Port/delete-port/${id}`, this.httpOptions).pipe(
      tap(_ => console.log(`Deleted port id=${id}`)),
      catchError(this.helper.handleError<Port>('deletePort'))
    );
  }
}
