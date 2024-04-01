import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustanciaComponent } from './sustancia.component';

describe('SustanciaComponent', () => {
  let component: SustanciaComponent;
  let fixture: ComponentFixture<SustanciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SustanciaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SustanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
