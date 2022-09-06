import {Inject, Injectable} from '@angular/core';
import {WOOSMAP_CONFIG_TOKEN, WoosmapConfig} from "./woosmap.tokens";
import {Observable, shareReplay} from "rxjs";

/**
 * @see https://developers.woosmap.com/products/localities/details/#response
 */
export interface WoosmapLocalitiesResponse {
  localities: {
    location: {
      lat: number;
      lng: number;
    };
    type: string;
    iata_code: string;
  }[];
}

/**
 * Service used to interact with Woosmap API
 * The javascript script for maps will only be included if a subscription on map$ is present
 */
@Injectable({
  providedIn: 'root'
})
export class WoosmapService {

  /**
   * Observable that emits the Woosmap map object, load the script on subscription if not present yet
   */
  map$: Observable<typeof woosmap.map>;

  constructor(@Inject(WOOSMAP_CONFIG_TOKEN) private woosmapConfig: WoosmapConfig) {
    this.map$ = new Observable<typeof woosmap.map>((subscriber) => {
      // If the script is somehow already loaded, just use the existing object
      if (typeof woosmap !== 'undefined' && woosmap.map) {
        subscriber.next(woosmap.map);
        subscriber.complete();
      }

      // If not, we need to load the script
      const script = document.createElement('script');
      script.src = `https://sdk.woosmap.com/map/map.js?key=${woosmapConfig.apiKey}`;
      script.defer = true;
      script.onload = () => {
        subscriber.next(woosmap.map);
        subscriber.complete();
      };
      script.onerror = (err) => {
        subscriber.error(err);
      };
      document.head.appendChild(script);

      // Teardown logic
      return () => {
        document.head.removeChild(script);
      };
    }).pipe(shareReplay(1));
  }

  /**
   * Retrieve coordinates for specific location using Woosmap Localities API
   * @param iataCode
   */
  async getCoordinatesForAirport(iataCode: string): Promise<{ lat: number; lng: number } | undefined> {
      const url = `https://api.woosmap.com/localities/autocomplete?key=${this.woosmapConfig.apiKey}&input=${iataCode}&types=airport`;
      const response = await fetch(url);
      const responseBody = await response.json() as WoosmapLocalitiesResponse;
      // The response is not typed, we need to make sure it fits our model
      const location = responseBody?.localities?.find((l: any) => l.type === 'airport' && l.iata_code === iataCode)?.location;
      if (location && location.lat && location.lng) {
        return responseBody.localities.find((locality) => locality.type === 'airport' && locality.iata_code === iataCode)?.location;
      }
      throw new Error('Incorrect response from the API');
  }
}
