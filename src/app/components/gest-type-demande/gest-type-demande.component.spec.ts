import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestTypeDemandeComponent } from './gest-type-demande.component';

describe('GestTypeDemandeComponent', () => {
  let component: GestTypeDemandeComponent;
  let fixture: ComponentFixture<GestTypeDemandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestTypeDemandeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestTypeDemandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
