import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoyageDialogComponent } from './voyage-dialog.component';

describe('VoyageDialogComponent', () => {
  let component: VoyageDialogComponent;
  let fixture: ComponentFixture<VoyageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoyageDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoyageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
