import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleExportacionesComponent } from './detalle-exportaciones.component';

describe('DetalleExportacionesComponent', () => {
  let component: DetalleExportacionesComponent;
  let fixture: ComponentFixture<DetalleExportacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleExportacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleExportacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
