import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleImportacionesComponent } from './detalle-importaciones.component';

describe('DetalleImportacionesComponent', () => {
  let component: DetalleImportacionesComponent;
  let fixture: ComponentFixture<DetalleImportacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleImportacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleImportacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
