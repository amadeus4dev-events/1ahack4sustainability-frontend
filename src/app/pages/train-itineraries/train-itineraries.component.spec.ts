import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainItinerariesComponent } from './train-itineraries.component';

describe('TrainItinerariesComponent', () => {
  let component: TrainItinerariesComponent;
  let fixture: ComponentFixture<TrainItinerariesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainItinerariesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainItinerariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
