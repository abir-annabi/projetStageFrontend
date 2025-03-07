import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeComponent } from './add-type.component';

describe('AddTypeComponent', () => {
  let component: AddTypeComponent;
  let fixture: ComponentFixture<AddTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
