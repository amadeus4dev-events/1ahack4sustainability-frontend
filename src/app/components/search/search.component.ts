import { AirportLocation } from '@amadeus/self-service-sdk-v1/models/base/airport-location/airport-location';
import { Component, EventEmitter, forwardRef, OnDestroy, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchFormData } from './search.interfaces';

/**
 * Form to fill the search data. It will behave as a form control for its parent component.
 * @see ControlValueAccessor pattern for more information
 * You can check https://www.youtube.com/watch?v=kVbLSN0AW-Y for Google ngConf presentation on the subject
 *
 */
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchComponent),
      multi: true
    }
  ]
})
export class SearchComponent implements OnDestroy, ControlValueAccessor {

  /**
   * Emit when the user submitted the form
   */
  @Output()
  search = new EventEmitter<void>();

  /**
   * Internal form to manage the component data model
   */
  formGroup = new FormGroup({
    originLocation: new FormControl<AirportLocation | null>(
      null, [Validators.required]
    ),
    destinationLocation: new FormControl<AirportLocation | null>(
      null, [Validators.required]
    ),
    departureDate: new FormControl<Date | null>(
      null, [Validators.required]
    )
  });
  /**
   * Reference to the subscriptions in the component to clean them
   * upon component deletion
   * This improve the performances as we do not have any loose subscription running over the application
   */
  subscriptions: Subscription[] = [];

  constructor() {
    // Every time the form is updated, share the value to the form in the parent
    this.subscriptions.push(this.formGroup.valueChanges.subscribe((value) => {
      this.onChange(value);
      this.onTouched();
    }));
  }

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

  /**
   * Emit the search submit event
   */
  onSearch(): void {
    if (this.formGroup.valid) {
      this.search.emit();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Register the onChange methods to the parent form onChange method.
   * That means that if you call the onChange method the parent form will be marked as changed and the value will be emitted.
   * This is part of the ControlValueAccessor pattern
   *
   * @param fn parent form onChange function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register the onTouched methods to the parent form onTouch method.
   * That means that if you call the onTouched method the parent form will be marked as touched.
   * This is part of the ControlValueAccessor pattern
   *
   * @param fn parent form onTouched function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Called whenever the parent form linked to component is updated
   * Reflect the changes in the SearchComponent
   *
   * @param obj: Form data model
   */
  writeValue(obj: Partial<SearchFormData>): void {
    if (obj) {
      this.formGroup.setValue({
        originLocation: null,
        destinationLocation: null,
        departureDate: null,
        ...obj || {}
      });
    }
  }
}
