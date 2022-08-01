import { AirportLocation } from '@amadeus/self-service-sdk-v1/models/base/airport-location/airport-location';

/**
 * Model that will be used to interact with the search component
 */
export interface SearchFormData {
  originLocation: AirportLocation | null;
  destinationLocation: AirportLocation | null;
  departureDate: Date | null;
}

/**
 * Model that will be used after form validation.
 * Same as `SearchFormData` but none of the fields are Nullable
 */
export type ValidSearchFormData = { [K in keyof SearchFormData]: NonNullable<SearchFormData[K]> };
