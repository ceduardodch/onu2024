import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustanciasComponent } from './sustancia.component';

describe('SustanciaComponent', () => {
  let component: SustanciasComponent;
  let fixture: ComponentFixture<SustanciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SustanciasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SustanciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
