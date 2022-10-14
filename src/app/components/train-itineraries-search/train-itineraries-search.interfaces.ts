
/**
 * Model that will be used to interact with the search component
 */
export interface SearchFormData {
  originLocation: string;
  destinationLocation: string;
  
}

/**
 * Model that will be used after form validation.
 * Same as `SearchFormData` but none of the fields are Nullable
 */
export type ValidSearchFormData = { [K in keyof SearchFormData]: NonNullable<SearchFormData[K]> };
