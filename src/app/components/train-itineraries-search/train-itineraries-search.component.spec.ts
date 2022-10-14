import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainItinerariesSearchComponent } from './train-itineraries-search.component';

describe('TrainItinerariesSearchComponent', () => {
  let component: TrainItinerariesSearchComponent;
  let fixture: ComponentFixture<TrainItinerariesSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainItinerariesSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainItinerariesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
