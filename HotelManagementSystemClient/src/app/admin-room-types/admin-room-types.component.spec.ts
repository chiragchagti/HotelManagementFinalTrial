import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomTypesComponent } from './admin-room-types.component';

describe('AdminRoomTypesComponent', () => {
  let component: AdminRoomTypesComponent;
  let fixture: ComponentFixture<AdminRoomTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRoomTypesComponent]
    });
    fixture = TestBed.createComponent(AdminRoomTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
