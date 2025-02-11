import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSignataireComponent } from './edit-signataire.component';

describe('EditSignataireComponent', () => {
  let component: EditSignataireComponent;
  let fixture: ComponentFixture<EditSignataireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditSignataireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditSignataireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
