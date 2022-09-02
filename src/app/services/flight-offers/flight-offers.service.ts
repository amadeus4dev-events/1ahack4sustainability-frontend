import { Dictionaries, FlightOffer, SearchFlightOffersRequestData, ShoppingApi } from '@amadeus/self-service-sdk-v2';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, merge, Observable, of, ReplaySubject, shareReplay, switchMap, } from 'rxjs';
import { ApiManager } from '../api-manager/api-manager.service';

/**
 * Service to manage your flight offer availabilities according to the user search.
 * The service provide both the list of the raw data returned by the api and the dictionaries to resolve the data.
 */
@Injectable({
  providedIn: 'root'
})
export class FlightOffersService {
  /**
   * Get the latest loaded flight offers
   */
  public flightOffers$: Observable<FlightOffer[] | undefined>;

  /**
   * Get the current state of flight offers loading
   */
  public isLoading$: Observable<boolean>;

  /**
   * Data with all the dictionaries returned by the latest api call
   * This is not a stream so make sure to only call it with your latest call data
   */
  public dictionaries: {[key: string]: any} = {};

  /**
   * Object to perform requests to the shopping endpoint
   *
   * @private
   */
  private api: ShoppingApi;

  /**
   * Stream with all the user request
   *
   * @private
   */
  private searchFlightRequestSubject = new ReplaySubject<SearchFlightOffersRequestData>(1);

  constructor(apiManager: ApiManager) {
    this.api = apiManager.getShoppingApi();
    const flightResponse$ = this.searchFlightRequestSubject.pipe(
      filter((search) => !!search),
      switchMap((request: SearchFlightOffersRequestData | undefined) =>
        request ? this.getOffers(request) : of({data: undefined, dictionaries: {}})),
      shareReplay(1),
    );

    this.flightOffers$ = flightResponse$.pipe(map(({data}) => data));
    flightResponse$.subscribe(
      (response) => this.dictionaries = response.dictionaries || {}
    );
    this.isLoading$ = merge(
      this.searchFlightRequestSubject.pipe(map(() => true)),
      this.flightOffers$.pipe(map(() => false))
    );
  }

  /**
   * Request a search of flight offers
   *
   * @param request
   */
  public searchFlightOffers(request: SearchFlightOffersRequestData) {
    this.searchFlightRequestSubject.next(request);
    return this.flightOffers$;
  }

  /**
   * Resolve the aircraft name from the dictionaries returned by the latest api call
   * Caution: If the resulting call has not been computed yet, the result might not reflect it.
   *
   * @param aircraftCode
   */
  public getAircraftName(aircraftCode: string) {
    const aircraft = this.dictionaries['aircraft'];
    if (aircraft) {
      return aircraft[aircraftCode];
    }
    return '';
  }

  /**
   * Resolve the airline name from the dictionaries returned by the latest api call
   * Caution: If the resulting call has not been computed yet, the result might not reflect it.
   *
   * @param airlineCode
   */
  public getAirlineName(airlineCode: string) {
    const airlines = this.dictionaries['carriers'];
    if (airlines) {
      return airlines[airlineCode];
    }
    return '';
  }

  /**
   * Resolve the city code from the dictionaries returned by the latest api call
   * Caution: If the resulting call has not been computed yet, the result might not reflect it.
   *
   * @param locationCode
   */
  public getCityCode(locationCode: string) {
    const locations = this.dictionaries['locations'];
    if (locations) {
      return locations[locationCode].cityCode;
    }
    return '';
  }


  /**
   * Perform the api call to retrieve the flights matching the request
   *
   * @param request
   * @private
   */
  private getOffers(request: SearchFlightOffersRequestData) {
    return this.api.searchFlightOffers(request)
      .then((response) => response)
      .catch((err) => {
        console.error(err);
        return {data: undefined, dictionaries: {}};
      });
  }
}
