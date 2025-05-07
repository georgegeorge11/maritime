import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject, catchError, Observable, of, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Port } from '../../models/port.model';
import { PortService } from '../../services/port.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { PortDialogComponent } from '../../components/dialogs/port-dialog/port-dialog.component';
import {Voyage} from '../../models/voyage.model';

@Component({
  selector: 'app-port',
  standalone: true,
  imports: [
    MatTableModule,
    AsyncPipe,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './port.component.html',
  styleUrl: './port.component.scss'
})
export class PortComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['name', 'country', 'actions'];
  private refreshData$ = new BehaviorSubject<void>(undefined);
  private destroy$ = new Subject<void>();
  private portService = inject(PortService);
  private dialog = inject(MatDialog);

  ports$: Observable<Port[]> | undefined;
  error: string | null = null;
  isLoading = true;

  ngOnInit() {
    this.loadPorts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPorts(): void {
    this.isLoading = true;
    this.error = null;
    this.ports$ = this.refreshData$.pipe(
      startWith(undefined),
      switchMap(() => this.portService.getPorts()),
      tap(() => this.isLoading = false),
      catchError(err => {
        console.error('Error loading ports:', err);
        this.error = 'Failed to load ports.';
        this.isLoading = false;
        return of([]);
      }),
      takeUntil(this.destroy$)
    );
  }

  refreshPorts(): void {
    this.isLoading = true;
    this.refreshData$.next();
  }

  addPort(): void {
    const dialogRef = this.dialog.open(PortDialogComponent, {
      width: '500px',
      data: { isEditing: false, port: {} }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.portService.addPort(result).subscribe({
          next: () => this.refreshPorts(),
          error: (err) => {
            console.error('Add failed:', err);
            this.error = 'Failed to add port.';
          }
        });
      }
    });
  }

  updatePort(selectedPort: Port): void {
    const dialogRef = this.dialog.open(PortDialogComponent, {
      width: '500px',
      data: { isEditing: true, port: { ...selectedPort } }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.portService.updatePort(selectedPort.portPK, result).subscribe({
          next: () => this.refreshPorts(),
          error: (err) => {
            console.error('Update failed:', err);
            this.error = 'Failed to update port.';
          }
        });
      }
    });
  }

  deletePort(port: Port): void {
    if (confirm(`Are you sure you want to delete port "${port.name}"?`)) {
      this.portService.deletePort(port.portPK).subscribe({
        next: () => this.refreshPorts(),
        error: (err) => {
          console.error('Delete failed:', err);
          this.error = 'Failed to delete port.';
        }
      });
    }
  }
}
