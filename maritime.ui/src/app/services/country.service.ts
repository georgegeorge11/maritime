import {inject, Injectable} from '@angular/core';
import {environment} from '../../environments/environment.development';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HelperService} from '../utils/helper.service';
import {Country} from '../models/country.model';
import {catchError, Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  apiURL: string = environment.apiURL;
  http=inject(HttpClient);
  helper = inject(HelperService)
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor() { }

  getCountriesVisitedLastYear(): Observable<Country[]> {
    console.log('CountryVisitService: Fetching countries visited from API...');
    return this.http.get<Country[]>(this.apiURL+ 'Country/visited-last-year')
      .pipe(catchError(this.helper.handleError<Country[]>('getCountriesVisitedLastYear', [])));
  }


  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiURL + 'Country/get-countries')
      .pipe(
        tap(() => console.log('Fetched countries')),
        catchError(this.helper.handleError<Country[]>('getCountries', []))
      );
  }

  getCountry(id: number): Observable<Country> {
    return this.http.get<Country>(this.apiURL + `Country/get-country/${id}`)
      .pipe(
        tap(() => console.log(`Fetched country id=${id}`)),
        catchError(this.helper.handleError<Country>('getCountry'))
      );
  }

  addCountry(newCountry: Country): Observable<Country> {
    return this.http.post<Country>(this.apiURL + 'Country/add-country', newCountry, this.httpOptions)
      .pipe(
        tap((country: Country) => console.log(`Added country w/ id=${country.countryPK}`)),
        catchError(this.helper.handleError<Country>('addCountry'))
      );
  }

  updateCountry(id: number, country: Country): Observable<Country> {
    return this.http.put<Country>(this.apiURL + `Country/update-country/${id}`, country, this.httpOptions)
      .pipe(
        tap(() => console.log(`Updated country id=${id}`)),
        catchError(this.helper.handleError<any>('updateCountry'))
      );
  }

  deleteCountry(id: number): Observable<Country> {
    return this.http.delete<Country>(this.apiURL + `Country/delete-country/${id}`, this.httpOptions)
      .pipe(
        tap(() => console.log(`Deleted country id=${id}`)),
        catchError(this.helper.handleError<Country>('deleteCountry'))
      );
  }
}
