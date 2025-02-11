import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestStructComponent } from './gest-struct.component';

describe('GestStructComponent', () => {
  let component: GestStructComponent;
  let fixture: ComponentFixture<GestStructComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestStructComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestStructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
