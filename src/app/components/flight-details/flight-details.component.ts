import { GeoCode } from '@amadeus/self-service-sdk-v1';
import { Itineraries } from '@amadeus/self-service-sdk-v2';
import { Component, Input } from '@angular/core';
import { utils } from '@dapi/sdk-core';
import { from, map, merge, Observable, of, ReplaySubject, shareReplay, switchMap } from 'rxjs';
import { ApiManager } from '../../services/api-manager';
import { FlightOffersService } from '../../services/flight-offers';
import { LocationsService } from '../../services/locations';

/**
 * Component to display the details of your flight itinerary
 * Contains a view with the segment information and another with a map to visually render the itinerary
 */
@Component({
  selector: 'app-flight-details',
  templateUrl: './flight-details.component.html',
  styleUrls: ['./flight-details.component.scss']
})
export class FlightDetailsComponent {

  /**
   * Itinerary that will be detailed with each segment information
   */
  @Input()
  public flightItinerary?: Itineraries;

  /**
   * Classic displays the itinerary details
   * Map renders a map with all the departure/arrival points
   * (counting stops)
   */
  public view: 'classic' | 'map' = 'classic';
  /**
   * Data stream that emits the list of points of departure and arrival to display in the map
   */
  public endPoints$: Observable<{ departureTime?: utils.DateTime, arrivalTime?: utils.DateTime, coords: GeoCode, iataCode: string }[]>;
  /**
   * Emits boolean according to the loading status of the map
   */
  public isMapLoading$: Observable<boolean>;
  /**
   * Emits when the itinerary to display is updated
   *
   * @private
   */
  private flightItineraryChanged = new ReplaySubject<Itineraries | undefined>();

  constructor(private apiManager: ApiManager, private offersService: FlightOffersService, private locationsService: LocationsService) {
    this.endPoints$ = this.flightItineraryChanged.asObservable().pipe(
      switchMap(() => this.getEndPoints()),
      shareReplay(1)
    );
    this.isMapLoading$ = merge(
      this.flightItineraryChanged.pipe(map(() => true)),
      this.endPoints$.pipe((map(() => false)))
    );
  }

  ngOnChanges() {
    this.flightItineraryChanged.next(this.flightItinerary);
  }

  /**
   * Return a flatten list of all the departure and arrival points in the whole itinerary.
   * If the flight is direct, it will consist in the departure and arrival.
   *
   * @private
   */
  private getEndPoints() {
    if (!this.flightItinerary) {
      return of([]);
    }
    const allAirports = this.flightItinerary.segments.map((s, index) => [
      ...index === 0 ? [{departureTime: s.departure?.at, iataCode: s.departure!.iataCode!}] : [],
      {
        arrivalTime: s.arrival?.at,
        iataCode: s.arrival!.iataCode!,
        departureTime: this.flightItinerary!.segments[index + 1]?.departure?.at
      }
    ]).flat();
    return from(Promise.all(
      allAirports
        .map(async (airport) => ({
          ...airport,
          coords: await this.getCoordinatesForAirport(airport.iataCode)}))
    )).pipe(
      map((endpoints) =>
        // Filter out invalid endpoints
       endpoints.filter((airport) => !!airport.coords) as { departureTime?: utils.DateTime, arrivalTime?: utils.DateTime, coords: GeoCode, iataCode: string }[]
      )
    );
  }

  /**
   * Compute the coordinates for an airport
   *
   * @param iataCode standard airport reference code as defined by the Internation Air Transport Association
   */
  private getCoordinatesForAirport(iataCode: string) {
    return this.locationsService.getCoordinatesForAirportWithWoosmap(iataCode).catch((_err) => {
      console.error(_err);
      return undefined;
    });
  }
}
