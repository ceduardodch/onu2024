import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorComponent } from './importador.component';

describe('ImportadorComponent', () => {
  let component: ImportadorComponent;
  let fixture: ComponentFixture<ImportadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportadorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
