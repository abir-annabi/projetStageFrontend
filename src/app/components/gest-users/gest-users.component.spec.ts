import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestUsersComponent } from './gest-users.component';

describe('GestUsersComponent', () => {
  let component: GestUsersComponent;
  let fixture: ComponentFixture<GestUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
