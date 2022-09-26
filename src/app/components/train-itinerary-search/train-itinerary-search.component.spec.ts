import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainItinerarySearchComponent } from './train-itinerary-search.component';

describe('TrainItinerarySearchComponent', () => {
  let component: TrainItinerarySearchComponent;
  let fixture: ComponentFixture<TrainItinerarySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainItinerarySearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainItinerarySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
