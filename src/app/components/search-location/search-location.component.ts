import { AirportLocation } from '@amadeus/self-service-sdk-v1/models/base/airport-location/airport-location';
import { Component, forwardRef, Input, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  Subscription,
  switchMap
} from 'rxjs';
import { ApiManager } from '../../services/api-manager';

/**
 * Autocomplete component to look for the airports/cities matching your search.
 * Will behave as a field for the parent component.
 *
 * @see ControlValueAccessor pattern for more information
 * You can check https://www.youtube.com/watch?v=kVbLSN0AW-Y for Google ngConf presentation on the subject
 */
@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchLocationComponent),
      multi: true
    }
  ]
})
export class SearchLocationComponent implements OnDestroy, ControlValueAccessor {
  /**
   * Field label
   */
  @Input()
  label!: string;

  /**
   * Internal form to manage the component data model
   * Here it will be the selected selection
   */
  control = new FormControl<AirportLocation | string>('', [
    Validators.required,
    (control) => typeof control.value === 'string' ? {invalidLocation: control.value} : null]
  );

  /**
   * Boolean stream to reflect the location search api call status
   */
  isLoading$: Observable<boolean>;

  /**
   * Data stream that will emit the list of location matching the search input
   */
  filteredLocations$: Observable<AirportLocation[]>;
  /**
   * Reference to the subscriptions in the component to clean them upon component deletion
   * This improve the performances as we do not have any loose subscription running over the application
   */
  subscriptions: Subscription[] = [];
  /**
   * Reference to the disable status from the parent form
   *
   * @see ControlValueAccessor
   */
  isDisabled = false;

  /**
   * Method to format the location returned by the api in the location field
   *
   * @param location
   */
  displayLocation = (location: AirportLocation | null) => location ? `${location.subType === 'CITY' ?
    location.address?.cityName : location.name} (${location.iataCode})` : '';

  /**
   * Reference to the parent form change status
   *
   * @see ControlValueAccessor
   */
  onChange: any = () => {};

  /**
   * Reference to the parent on touched function
   *
   * @see ControlValueAccessor
   */
  onTouched: any = () => {};

  constructor(private apiManagerService: ApiManager) {
    const loadRequested$ = this.control.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(350),
      map((value) => this.formatSearchRequest(value))
    )
    this.filteredLocations$ = loadRequested$.pipe(
      switchMap(value => value ? this.getLocations(value) : of([])),
      shareReplay(1)
    );
    this.isLoading$ = merge(
      loadRequested$.pipe(map(() => true)),
      this.filteredLocations$.pipe(map(() => false))
    );
    this.subscriptions.push(this.control.valueChanges.subscribe((v) => {
      if (typeof v !== 'string') {
        this.onChange(v);
        this.onTouched();
      }
    }));
  }

  /**
   * Retrieve the location matching the substring value
   *
   * @param value
   */
  getLocations(value: string) {
    return this.apiManagerService.getLocationApi().getAirportCitySearch({keyword: value, subType: ['AIRPORT', 'CITY']})
      .then((v) => v.data)
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  /**
   * Rework the value to search to match the api expectation
   *
   * @param value
   */
  formatSearchRequest(value: string | null | AirportLocation) {
    const stringValue = typeof value === 'string' ? value : this.displayLocation(value);
    return stringValue && stringValue.length > 2 ? stringValue : null
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Register the onChange methods to the parent form onChange method.
   * That means that if you call the onChange method the parent form will be marked as changed and the value will be emitted.
   * This is part of the {@link ControlValueAccessor} pattern
   *
   * @param fn parent form onChange function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register the onTouched methods to the parent form onTouch method.
   * That means that if you call the onTouched method the parent form will be marked as touched.
   * This is part of the {@link ControlValueAccessor} pattern
   *
   * @param fn parent form onTouched function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Link the parent formControl disable status to the internal disabled status
   *
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  /**
   * Called whenever the parent form linked to component is updated
   * Reflect the changes in the SearchComponent
   *
   * @param obj: Form data model
   */
  writeValue(obj: any): void {
    this.control.setValue(obj || null);
  }
}
