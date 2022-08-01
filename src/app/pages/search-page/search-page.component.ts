import { FlightOffer } from '@amadeus/self-service-sdk-v2';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { utils } from '@dapi/sdk-core';
import { SearchFormData } from '../../components/search/search.interfaces';
import { FlightOffersService } from '../../services/flight-offers';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {

  /**
   * Search form that will be submitted by the user
   */
  public searchForm: SearchFormData = {
    originLocation: null,
    destinationLocation: null,
    departureDate: null
  };

  constructor(private flightOffersService: FlightOffersService, router: Router) {
    const destinationLocation = router.getCurrentNavigation()?.extras.state?.['destinationLocation'];
    if (destinationLocation) {
      this.searchForm.destinationLocation = {
        iataCode: destinationLocation.iataCode,
        name: destinationLocation.name.toUpperCase(),
      };
    }
  }

  ngOnInit(): void {
  }

  /**
   * Search for flights matching the SearchPageComponent search form
   */
  onSearch() {
    this.flightOffersService.searchFlightOffers({
      getFlightOffersBody: {
        originDestinations: [
          {
            id: '1',
            originLocationCode: this.searchForm.originLocation!.iataCode,
            destinationLocationCode: this.searchForm.destinationLocation!.iataCode,
            departureDateTimeRange: {date: new utils.Date(this.searchForm.departureDate!.getTime())},
          }
        ],
        travelers: [
          {
            id: '1',
            travelerType: 'ADULT'
          }
        ],
        sources: ['GDS']
      }
    });
  }

  /**
   * Action when the user selected a flight.
   * It is up for you to decide if you want to play around with it.
   *
   * @param flightSelection
   */
  onFlightSelection(flightSelection: FlightOffer | undefined) {
    console.log('Flight selected', flightSelection);
  }
}
