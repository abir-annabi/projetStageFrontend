import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestSignataireComponent } from './gest-signataire.component';

describe('GestSignataireComponent', () => {
  let component: GestSignataireComponent;
  let fixture: ComponentFixture<GestSignataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestSignataireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestSignataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
