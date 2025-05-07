import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface CountryDialogData {
  isEditing: boolean;
  country: { name: string };
}

@Component({
  selector: 'app-country-dialog',
  standalone: true,
  templateUrl: './country-dialog.component.html',
  styleUrl: './country-dialog.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class CountryDialogComponent {
  countryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CountryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CountryDialogData
  ) {
    this.countryForm = this.fb.group({
      name: [data.country?.name || '', Validators.required]
    });
  }

  submit(): void {
    if (this.countryForm.valid) {
      this.dialogRef.close(this.countryForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close(null);
  }

  get name() {
    return this.countryForm.get('name');
  }
}
