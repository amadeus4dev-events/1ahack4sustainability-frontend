import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightRecapComponent } from './flight-recap.component';

describe('FlightRecapComponent', () => {
  let component: FlightRecapComponent;
  let fixture: ComponentFixture<FlightRecapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlightRecapComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FlightRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
