import {Component, inject, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule, DatePipe} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PortService} from '../../../services/port.service';
import {Port} from '../../../models/port.model';
import {Ship} from '../../../models/ship.model';
import {ShipService} from '../../../services/ship.service';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';

export interface VoyageDialogData {
  isEditing: boolean;
  voyage: {
    ship: Ship; voyageDate: Date; arrivalPort: Port, departurePort: Port, voyageStartDate: Date;
    voyageEndDate: Date;
  };
}

@Component({
  selector: 'app-voyage-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatCardModule,
    MatIconModule
  ],
  providers: [],
  templateUrl: './voyage-dialog.component.html',
  styleUrl: './voyage-dialog.component.scss'
})
export class VoyageDialogComponent implements OnInit {
  voyageForm: FormGroup;
  ports: Port[] = [];
  ships: Ship[] = [];
  isLoading = false;
  isSubmitting = false;
  datePipe = inject(DatePipe);
  portService = inject(PortService);
  shipService = inject(ShipService);
  snackBar = inject(MatSnackBar);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<VoyageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VoyageDialogData,
  ) {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

    this.voyageForm = this.fb.group({
      shipPK: [this.data.voyage.ship?.shipPK || '', Validators.required],
      voyageDate: [this.formatDateForInput(now), Validators.required],
      departurePortPK: [this.data.voyage.departurePort?.portPK || '', Validators.required],
      arrivalPortPK: [this.data.voyage.arrivalPort?.portPK || '', Validators.required],
      voyageStartDate: [this.formatDateTimeForInput(this.data.voyage.voyageStartDate), [Validators.required]],
      voyageEndDate: [this.formatDateTimeForInput(this.data.voyage.voyageEndDate), [Validators.required]]
    }, {validator: this.portValidator});
  }

  ngOnInit() {
    this.loadPorts();
    this.loadShips()
  }

  private loadPorts() {
    this.isLoading = true;
    this.portService.getPorts().subscribe({
      next: (res) => {
        this.ports = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch ports', err);
        this.snackBar.open('Failed to load ports', 'Close', {duration: 3000});
        this.isLoading = false;
      }
    });
  }

  private loadShips() {
    this.isLoading = true;
    this.shipService.getShips().subscribe({
      next: (res) => {
        this.ships = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch ships', err);
        this.snackBar.open('Failed to load ships', 'Close', {duration: 3000});
        this.isLoading = false;
      }
    });
  }

  // Custom validator to ensure departure and arrival ports are different
  private portValidator(group: FormGroup): { [key: string]: any } | null {
    const departurePort = group.get('departurePortPK')?.value;
    const arrivalPort = group.get('arrivalPortPK')?.value;

    return departurePort && arrivalPort && departurePort === arrivalPort
      ? {samePorts: true}
      : null;
  }

  submit() {
    if (this.voyageForm.invalid) {
      this.voyageForm.markAllAsTouched();
      this.snackBar.open('Please fill all required fields correctly', 'Close', {duration: 3000});
      return;
    }

    if (this.voyageForm.hasError('samePorts')) {
      this.snackBar.open('Departure and arrival ports must be different', 'Close', {duration: 3000});
      return;
    }

    // Validate date/time sequence
    const start = new Date(this.voyageForm.value.voyageStartDate);
    const end = new Date(this.voyageForm.value.voyageEndDate);

    if (start >= end) {
      this.snackBar.open('Voyage end must be after voyage start', 'Close', {duration: 3000});
      return;
    }

    this.isSubmitting = true;
    this.dialogRef.close(this.voyageForm.value);
  }

  cancel() {
    this.dialogRef.close(null);
  }

  get shipPK() {
    return this.voyageForm.get('shipPK');
  }

  get voyageDate() {
    return this.voyageForm.get('voyageDate');
  }

  get departurePortPK() {
    return this.voyageForm.get('departurePortPK');
  }

  get arrivalPortPK() {
    return this.voyageForm.get('arrivalPortPK');
  }

  get voyageStartDate() {
    return this.voyageForm.get('voyageStartDate');
  }

  get voyageEndDate() {
    return this.voyageForm.get('voyageEndDate');
  }

  private formatDateForInput(date: Date): string | null {
    return this.datePipe.transform(date, 'yyyy-MM-dd');
  }

  private formatDateTimeForInput(date: Date): string | null {
    return this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm');
  }
}
