import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRoomsDetailsComponent } from './admin-rooms-details.component';

describe('AdminRoomsDetailsComponent', () => {
  let component: AdminRoomsDetailsComponent;
  let fixture: ComponentFixture<AdminRoomsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminRoomsDetailsComponent]
    });
    fixture = TestBed.createComponent(AdminRoomsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
