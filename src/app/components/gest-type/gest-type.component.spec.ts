import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestTypeComponent } from './gest-type.component';

describe('GestTypeComponent', () => {
  let component: GestTypeComponent;
  let fixture: ComponentFixture<GestTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
