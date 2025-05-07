import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, startWith, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Country} from '../../models/country.model';
import {CountryService} from '../../services/country.service';
import {MatTableModule} from '@angular/material/table';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CountryDialogComponent} from '../../components/dialogs/country-dialog/country-dialog.component';

@Component({
  selector: 'app-country',
  imports: [ MatTableModule,
    AsyncPipe,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule],
  templateUrl: './country.component.html',
  styleUrl: './country.component.scss'
})
export class CountryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'actions'];
  private refreshData$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();

  private countryService = inject(CountryService);
  private dialog = inject(MatDialog);

  countries$!: Observable<Country[]>;
  error: string | null = null;
  isLoading = true;

  ngOnInit(): void {
    this.loadCountries();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCountries(): void {
    this.isLoading = true;
    this.error = null;

    this.countries$ = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.countryService.getCountries()),
      tap(() => this.isLoading = false),
      catchError(err => {
        console.error('Error loading countries:', err);
        this.error = 'Failed to load countries.';
        this.isLoading = false;
        return of([]);
      }),
      takeUntil(this.destroy$)
    );
  }

  refreshCountries(): void {
    this.isLoading = true;
    this.refreshData$.next();
  }

  addCountry(): void {
    const dialogRef = this.dialog.open(CountryDialogComponent, {
      width: '400px',
      data: { isEditing: false, country: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.countryService.addCountry(result).subscribe({
          next: () => this.refreshCountries(),
          error: (err) => {
            console.error('Add failed:', err);
            this.error = 'Failed to add country.';
          }
        });
      }
    });
  }

  updateCountry(selectedCountry: Country): void {
    const dialogRef = this.dialog.open(CountryDialogComponent, {
      width: '400px',
      data: { isEditing: true, country: { ...selectedCountry } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.countryService.updateCountry(selectedCountry.countryPK, result).subscribe({
          next: () => this.refreshCountries(),
          error: (err) => {
            console.error('Update failed:', err);
            this.error = 'Failed to update country.';
          }
        });
      }
    });
  }

  deleteCountry(country: Country): void {
    if (confirm(`Are you sure you want to delete country "${country.name}"?`)) {
      this.countryService.deleteCountry(country.countryPK).subscribe({
        next: () => this.refreshCountries(),
        error: (err) => {
          console.error('Delete failed:', err);
          this.error = 'Failed to delete country.';
        }
      });
    }
  }
}
