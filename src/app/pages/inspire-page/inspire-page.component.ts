import { GeoCode } from '@amadeus/self-service-sdk-v1';
import { PoiLocation } from '@amadeus/self-service-sdk-v1/models/base/poi-location';
import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivitiesService } from '../../services/activities';
import { GreenMilesService } from '../../services/green-miles';

/**
 * Supported destination model.
 */
interface Destination {
  /**
   * Display name of the destination
   */
  name: string;
  /**
   * Miles associated to your destination according to the drought level
   */
  greenMiles: number;
  /**
   * Worldwide standard code of your city / airport as defined by the International Air Transport Association
   */
  iataCode: string;
  /**
   * Theme associated to your location ('beach', 'city', etc.)
   */
  flavors: string[];
  /**
   * Latitude/Longitude of the location
   */
  geoCode: GeoCode;
}

@Component({
  selector: 'app-inspire-page',
  templateUrl: './inspire-page.component.html',
  styleUrls: ['./inspire-page.component.scss']
})
export class InspirePageComponent {
  /**
   * List of supported destination without the green miles and activities as they are dynamic data
   * @private
   */
  private static supportedDestination: Omit<Destination, 'greenMiles' | 'activities'>[] = [
    {
      name: 'Barcelona',
      iataCode: 'BCN',
      flavors: ['beach'],
      geoCode: {
        latitude: 41.29694,
        longitude: 2.07833
      }
    }, {
      name: 'San Francisco',
      iataCode: 'SFO',
      flavors: ['beach'],
      geoCode: {
        latitude: 37.61882,
        longitude: -122.37580
      }
    }, {
      name: 'Berlin',
      iataCode: 'BER',
      flavors: ['nature'],
      geoCode: {
        latitude: 52.36213,
        longitude: 13.50168
      }
    }, {
      name: 'Dallas',
      iataCode: 'DFW',
      flavors: ['nature'],
      geoCode: {
        latitude: 32.89595,
        longitude: -97.03720
      }
    }, {
      name: 'London',
      iataCode: 'LON',
      flavors: ['nature'],
      geoCode: {
        latitude: 51.50000,
        longitude: -0.16666
      }
    }, {
      name: 'Bangalore',
      iataCode: 'BLR',
      flavors: ['city'],
      geoCode: {
        latitude: 13.20071,
        longitude: 77.70879
      }
    }, {
      name: 'New York',
      iataCode: 'NYC',
      flavors: ['city'],
      geoCode: {
        latitude: 40.71417,
        longitude: -74.00583
      }
    }]
  /**
   * Flavor selected by the user used as a destination filter
   */
  public selectedFlavor: string | undefined;
  /**
   * Map with the available activities for a city location
   * Activities are data streams resolved via api calls
   */
  public activities$: { [cityCode: string]: Observable<PoiLocation[] | undefined> };
  /**
   * Stream to push the destination to display according to the flavor selected by the user
   * @private
   */
  private destinationsSubject = new Subject<Destination[]>();
  /**
   * Data stream with the list of destination to display in the inspiration page
   */
  public destinations$ = this.destinationsSubject.asObservable();

  constructor(private greenMileService: GreenMilesService, private activitiesService: ActivitiesService) {
    this.activities$ = this.activitiesService.activityPerCityMap$;
  }

  /**
   * Filter the available destination according the selected flavor or theme
   * Will load the activities for the destination if they are not yet loaded
   *
   * @param selectedFlavor
   */
  changeFlavor(selectedFlavor: string) {
    this.selectedFlavor = selectedFlavor;
    const destinations = InspirePageComponent.supportedDestination.filter(
      (destination) => selectedFlavor && destination.flavors.indexOf(selectedFlavor) > -1
    ).map((destination) => ({
      ...destination,
      greenMiles: this.greenMileService.greenDestinationMap[destination.iataCode]
    }));
    destinations.forEach(
      (destination) => this.activitiesService.loadActivities(destination.iataCode, destination.geoCode)
    )
    this.destinationsSubject.next(destinations);
  }
}
