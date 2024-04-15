import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearImportacionComponent } from './crear-importacion.component';

describe('CrearImportacionComponent', () => {
  let component: CrearImportacionComponent;
  let fixture: ComponentFixture<CrearImportacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearImportacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CrearImportacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});