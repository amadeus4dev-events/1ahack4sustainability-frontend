import { BookingApi, LocationApi, SearchApi, ShoppingApi as ShoppingApiV1 } from '@amadeus/self-service-sdk-v1';
import { ShoppingApi as ShoppingApiV2 } from '@amadeus/self-service-sdk-v2';
import { Inject, Injectable } from '@angular/core';
import { AmadeusGatewayTokenRequestPlugin, createAmadeusGatewayTokenRequest } from '@dapi/amadeus-gateway-sdk';
import {
  ApiFetchClient,
  CanceledCallError,
  ConcurrentFetch,
  FetchPluginContext,
  RetryFetch,
  WaitForFetch
} from '@dapi/sdk-core';
import { API_MANAGER_CONFIG_TOKEN, ApiManagerConfig } from './api-manager.tokens';

/**
 * Class to manage the calls to the Amadeus API endpoints.
 * Manage for you the authentication, call retries in case of a failure etc.
 */
@Injectable()
export class ApiManager {
  private gatewayPlugin: AmadeusGatewayTokenRequestPlugin;

  private locationApi!: LocationApi;
  private shoppingApi!: ShoppingApiV2;
  private pricingApi!: ShoppingApiV1;
  private searchApi!: SearchApi;
  private bookingApi!: BookingApi;

  /**
   * API client to use most of endpoints to perform booking, get location informations
   * or get pricing information for a date.
   *
   * @private
   */
  private clientV1: ApiFetchClient;

  /**
   * API client to retrieve the flight availabilities for a date.
   *
   * @private
   */
  private clientV2: ApiFetchClient;

  constructor(@Inject(API_MANAGER_CONFIG_TOKEN) apiManagerConfig: ApiManagerConfig) {
    this.gatewayPlugin = createAmadeusGatewayTokenRequest({
      gatewayUrl: apiManagerConfig.gatewayUrl,
      gatewayClientId: apiManagerConfig.gatewayClientId,
      gatewayClientPrivate: apiManagerConfig.gatewayClientPrivate
    });
    const retryCondition = (context: FetchPluginContext, data?: Response, err?: Error) => {
      return !(err instanceof CanceledCallError) && !(data?.status && [400, 404].includes(data.status));
    }
    const retryPlugin = new RetryFetch(apiManagerConfig.numberOfRetries, retryCondition, () => apiManagerConfig.sleepBetweenRetries);
    // TODO use concurrent plugin if it works :\
    const concurrentPlugin = new ConcurrentFetch(apiManagerConfig.maximumConcurrentCalls);
    const waitForPlugin = new WaitForFetch(() => new Promise((resolve) => setTimeout(() => resolve({result: true}), apiManagerConfig.delayBetweenRequests)));

    // Configure your API clients, you should not need to update this part.
    this.clientV1 = new ApiFetchClient({
      basePath: 'https://test.api.amadeus.com/v1',
      requestPlugins: [this.gatewayPlugin],
      fetchPlugins: [retryPlugin, waitForPlugin]
    });
    this.clientV2 = new ApiFetchClient({
      basePath: 'https://test.api.amadeus.com/v2',
      requestPlugins: [this.gatewayPlugin],
      fetchPlugins: [retryPlugin, waitForPlugin]
    });
  }

  /**
   * Return the API manager to help you with the location API.
   * It can help you with your calls to find location matching your criteria
   * or a specific location data (coordinates etc.).
   */
  public getLocationApi() {
    if (!this.locationApi) {
      this.locationApi = new LocationApi(this.clientV1);
    }
    return this.locationApi;
  }

  /**
   * Return the API manager to help you with the shopping API.
   * It can help you with your calls to find availabilities matching your criteria
   */
  public getShoppingApi() {
    if (!this.shoppingApi) {
      this.shoppingApi = new ShoppingApiV2(this.clientV2);
    }
    return this.shoppingApi;
  }

  /**
   * Return the API manager to help you with the pricing API.
   * It can help you with your confirm the pricing of a flight offer
   */
  public getPricingApi() {
    if (!this.pricingApi) {
      this.pricingApi = new ShoppingApiV1(this.clientV1);
    }
    return this.pricingApi;
  }

  /**
   * Return the API manager to help you with the booking API.
   * It can help you to book a flight offer
   */
  public getBookingApi() {
    if (!this.bookingApi) {
      this.bookingApi = new BookingApi(this.clientV1);
    }
    return this.bookingApi;
  }

  /**
   * Return the API manager to help you with the search API.
   * It can provide you data on the point of interest, the activities and many information
   * related to your location.
   */
  public getSearchApi() {
    if (!this.searchApi) {
      this.searchApi = new SearchApi(this.clientV1);
    }
    return this.searchApi;
  }
}
