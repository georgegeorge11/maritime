import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, catchError, Observable, of, startWith, Subject, switchMap, takeUntil, tap} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {Port} from '../../models/port.model';
import {ShipService} from '../../services/ship.service';
import {ShipDialogComponent} from '../../components/dialogs/ship-dialog/ship-dialog.component';
import {Ship} from '../../models/ship.model';
import {AsyncPipe, CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {
  MatTableModule
} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-ship',
  imports: [
    MatTableModule,
    AsyncPipe,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ship.component.html',
  styleUrl: './ship.component.scss'
})
export class ShipComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'country', 'actions'];
  private refreshData$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();
  private shipService = inject(ShipService);
  private dialog = inject(MatDialog);
  ships$: Observable<Ship[]> | undefined;
  error: string | null = null;
  isLoading = true;

  ngOnInit() {
    this.loadShips()
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadShips() {
    this.isLoading = true;
    this.error = null;
    this.ships$ = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.shipService.getShips()),
      tap(() => this.isLoading = false),
      catchError(err => {
        console.error('Error loading ships:', err);
        this.error = 'Failed to load ships.';
        this.isLoading = false;
        return of([]);
      }),
      takeUntil(this.destroy$)
    );
  }

  refreshShips(): void {
    this.isLoading = true;
    this.refreshData$.next();
  }

  addShip() {
    const dialogRef = this.dialog.open(ShipDialogComponent, {
      width: '500px',
      data: {isEditing: false, ship: {}}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shipService.addShip(result).subscribe({
          next: () => this.refreshShips(),
          error: (err) => {
            console.error('Add failed:', err);
            this.error = 'Failed to add port.';
          }
        });
      }
    });
  }

  updateShip(ship: Ship) {
    const dialogRef = this.dialog.open(ShipDialogComponent, {
      width: '500px',
      data: {isEditing: true, ship: {...ship}}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.shipService.updateShip(ship.shipPK,result).subscribe({
          next: () => this.refreshShips(),
          error: (err) => {
            console.error('Add failed:', err);
            this.error = 'Failed to update ship.';
          }
        });
      }
    });
  }

  deleteShip(ship: Ship) {
    if (confirm(`Are you sure you want to delete ship "${ship.name}"?`)) {
      this.shipService.deleteShip(ship.shipPK).subscribe({
        next: () => this.refreshShips(),
        error: (err) => {
          console.error('Delete failed:', err);
          this.error = 'Failed to delete port.';
        }
      });
    }
  }

}
