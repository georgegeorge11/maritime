import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Country } from '../../../models/country.model';
import { MatSelectModule } from '@angular/material/select';
import {CountryService} from '../../../services/country.service';

export interface PortDialogData {
  isEditing: boolean;
  port: { name: string; country: Country };
}

@Component({
  selector: 'app-port-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './port-dialog.component.html',
  styleUrl: './port-dialog.component.scss'
})
export class PortDialogComponent implements OnInit {
  portForm: FormGroup;
  countries: Country[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PortDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PortDialogData,
    private countryService: CountryService
  ) {
    this.portForm = this.fb.group({
      name: [data.port?.name || '', Validators.required],
      countryPK: [data.port?.country?.countryPK || '', Validators.required]
    });
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe({
      next: (res) => this.countries = res,
      error: (err) => console.error('Failed to fetch countries', err)
    });
  }

  submit() {
    if (this.portForm.valid) {
      this.dialogRef.close(this.portForm.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  get name() { return this.portForm.get('name'); }
  get countryPK() { return this.portForm.get('countryPK'); }
}
