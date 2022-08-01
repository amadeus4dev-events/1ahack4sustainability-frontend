import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightListComponent } from './flight-list.component';

describe('FlightSelectionComponent', () => {
  let component: FlightListComponent;
  let fixture: ComponentFixture<FlightListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlightListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
