import { GeoCode, LocationApi } from '@amadeus/self-service-sdk-v1';
import { Injectable } from '@angular/core';
import { ApiManager } from '../api-manager';
import { FlightOffersService } from "../flight-offers";
import { WoosmapService } from "../woosmap/woosmap.service";

/**
 * Service to retrieve location data such as the coordinates
 */
@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  /**
   * Object to perform requests to the location endpoint
   *
   * @private
   */
  private api: LocationApi;
  /**
   * Cache to avoid performing unnecessary calls
   *
   * @private
   */
  private coordinatesCache: { [locationId: string]: GeoCode | undefined } = {};

  constructor(apiManager: ApiManager, private flightOffersService: FlightOffersService, private woosmapService: WoosmapService) {
    this.api = apiManager.getLocationApi();
  }

  /**
   * Retrieve coordinates for specific location using Self Service API
   * @param iataCode
   */
  async getCoordinatesForAirport(iataCode: string) {
    if (!this.coordinatesCache[iataCode]) {
      // We need to get the locationId to use the Self Service API
      // locationId is the iataCode prefixed with a C for City (LON -> CLON for ex) or an A for Airport (LHR -> ALHR for ex)
      const cityCode = this.flightOffersService.getCityCode(iataCode);
      const locationId = iataCode === cityCode ? `C${iataCode}` : `A${iataCode}`;

      this.coordinatesCache[iataCode] = await this.api.getAirportCity({locationId}).then((result) => result.data.geoCode);
    }
    return this.coordinatesCache[iataCode];
  }

  /**
   * Retrieve coordinates for specific location using Woosmap Localities API
   * @param iataCode
   */
  async getCoordinatesForAirportWithWoosmap(iataCode: string) {
    if (!this.coordinatesCache[iataCode]) {
      const coordinates = await this.woosmapService.getCoordinatesForAirport(iataCode);
      if (coordinates) {
        this.coordinatesCache[iataCode] = {latitude: coordinates.lat, longitude: coordinates.lng};
      }
    }
    return this.coordinatesCache[iataCode];
  }
}
