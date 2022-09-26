import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SearchFormData } from '../../components/train-itinerary-search/train-itinerary-search.interfaces';
import { TrainItinerariesService } from '../../services/TrainItineraries/train-itineraries.service';

@Component({
  selector: 'app-train-itineraries',
  templateUrl: './train-itineraries.component.html',
  styleUrls: ['./train-itineraries.component.scss']
})
export class TrainItinerariesComponent implements OnInit {

  /**
   * Search form that will be submitted by the user
   */
  public searchForm: SearchFormData = {
    originLocation: "",
    destinationLocation: ""
  };

  constructor(private trainItinerariesService: TrainItinerariesService, router: Router) {
    const destinationLocation = router.getCurrentNavigation()?.extras.state?.['destinationLocation'];
    if (destinationLocation) {
      this.searchForm.destinationLocation = destinationLocation;
    }
  }

  ngOnInit(): void {
  }

  /**
   * Search for flights matching the SearchPageComponent search form
   */
  onSearch() {
    console.log('Searching', this.searchForm.originLocation, this.searchForm.destinationLocation);
    this.trainItinerariesService.getTrainItineraries(this.searchForm.originLocation, this.searchForm.destinationLocation);
  }

}
