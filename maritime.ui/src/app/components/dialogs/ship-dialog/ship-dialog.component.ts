import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatInputModule} from '@angular/material/input';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';

export interface ShipDialogData {
  isEditing: boolean;
  ship: { name: string; maximumSpeed: number };
}

@Component({
  selector: 'app-ship-dialog',
  imports: [
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    MatButtonModule],
  templateUrl: './ship-dialog.component.html',
  styleUrl: './ship-dialog.component.scss'
})
export class ShipDialogComponent {
  shipForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<ShipDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ShipDialogData) {
    this.shipForm = this.formBuilder.group({
      name: [data.ship?.name || '', Validators.required],
      maximumSpeed: [data.ship?.maximumSpeed || 0, Validators.required]
    })
  }

  submit() {
    if (this.shipForm.valid) {
      this.dialogRef.close(this.shipForm.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  get name() {
    return this.shipForm.get('name');
  }

  get maximumSpeed() {
    return this.shipForm.get('maximumSpeed');
  }
}
