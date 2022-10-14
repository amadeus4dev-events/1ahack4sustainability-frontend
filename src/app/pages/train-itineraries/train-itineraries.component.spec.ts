import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainItinerariesPageComponent } from './train-itineraries.component';

describe('TrainItinerariesPageComponent', () => {
  let component: TrainItinerariesPageComponent;
  let fixture: ComponentFixture<TrainItinerariesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainItinerariesPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainItinerariesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
