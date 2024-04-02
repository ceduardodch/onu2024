import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveedorsComponent } from './proveedor.component';

describe('ProveedorComponent', () => {
  let component: ProveedorsComponent;
  let fixture: ComponentFixture<ProveedorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProveedorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProveedorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
