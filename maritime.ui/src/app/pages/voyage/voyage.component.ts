import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {BehaviorSubject, catchError, Observable, of, startWith, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {VoyageService} from '../../services/voyage.service';
import {Voyage} from '../../models/voyage.model';
import {VoyageDialogComponent} from '../../components/dialogs/voyage-dialog/voyage-dialog.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-voyage',
  imports: [MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinnerModule],
  templateUrl: './voyage.component.html',
  styleUrl: './voyage.component.scss'
})
export class VoyageComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['ship', 'voyageDate', 'departurePort', 'arrivalPort', 'voyageStart', 'voyageEnd', 'actions'];
  private refreshData$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();
  private voyageService = inject(VoyageService);
  private dialog = inject(MatDialog);
  voyages$: Observable<Voyage[]> | undefined;
  error: string | null = null;
  isLoading = true;

  ngOnInit() {
    this.loadVoyages();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadVoyages(): void {
    this.isLoading = true;
    this.error = null;
    this.voyages$ = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.voyageService.getVoyages()),
      tap(() => this.isLoading = false),
      catchError(err => {
        console.error('Error loading voyages:', err);
        this.error = 'Failed to load voyages.';
        this.isLoading = false;
        return of([]);
      }),
      takeUntil(this.destroy$)
    );
  }

  refresh(): void {
    this.isLoading = true;
    this.refreshData$.next();
  }


  addVoyage() {
    const dialogRef = this.dialog.open(VoyageDialogComponent, {
      data: {isEditing: false, voyage: {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.voyageService.addVoyage(result).subscribe({
          next: () => this.refresh(),
          error: (err) => {
            console.error('Add failed:', err);
            this.error = 'Failed to add voyage.';
          }
        });

      }
    });
  }

  updateVoyage(voyage: Voyage) {
    const dialogRef = this.dialog.open(VoyageDialogComponent, {
      data: {isEditing: false, voyage: {...voyage}}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.voyageService.updateVoyage(voyage.voyagePK,result).subscribe({
          next: () => this.refresh(),
          error: (err) => {
            console.error('Add failed:', err);
            this.error = 'Failed to update voyage.';
          }
        });

      }
    });
  }

  deleteVoyage(voyage: Voyage) {
    if (confirm(`Are you sure you want to delete voyage from "${voyage.departurePort.name}" to "${voyage.arrivalPort.name}" ?`)) {
      this.voyageService.deleteVoyage(voyage.voyagePK).subscribe({
        next: () => this.refresh(),
        error: (err) => {
          console.error('Delete failed:', err);
          this.error = 'Failed to delete voyage.';
        }
      });
    }
  }

}
