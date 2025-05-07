import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipDialogComponent } from './ship-dialog.component';

describe('ShipDialogComponent', () => {
  let component: ShipDialogComponent;
  let fixture: ComponentFixture<ShipDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
