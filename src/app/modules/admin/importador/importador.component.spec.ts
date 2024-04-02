import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorsComponent } from './importador.component';

describe('ImportadorComponent', () => {
  let component: ImportadorsComponent;
  let fixture: ComponentFixture<ImportadorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportadorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportadorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
