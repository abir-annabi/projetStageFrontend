import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStructComponent } from './add-struct.component';

describe('AddStructComponent', () => {
  let component: AddStructComponent;
  let fixture: ComponentFixture<AddStructComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStructComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
