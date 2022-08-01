import { FlightOffer } from '@amadeus/self-service-sdk-v2';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, combineLatestWith, filter, map, Observable, Subscription } from 'rxjs';
import { FlightOffersService } from '../../services/flight-offers';

@Component({
  selector: 'app-flight-list',
  templateUrl: './flight-list.component.html',
  styleUrls: ['./flight-list.component.scss']
})
export class FlightListComponent {

  @Output()
  flightSelection: EventEmitter<FlightOffer | undefined> = new EventEmitter();

  /**
   * Object selected by the user
   */
  public selectedItem?: FlightOffer;

  /**
   * A data stream of the flight offers that can be added to the user cart.
   * They contain pricing information as well as the flight information.
   */
  public flights$: Observable<FlightOffer[] | undefined>;

  /**
   * Data stream that will emit when the flight list is being fetched from the api
   */
  public isLoading$: Observable<boolean>;
  /**
   * Data stream that emits the current value of the show more
   */
  public showMore$: Observable<boolean>;
  /**
   * Manage the show more as a boolean stream updated upon click on show more
   * @private
   */
  private showMoreSubject = new BehaviorSubject(false);
  /**
   * Keep track of all the subscription to destroy them upon component deletion
   * @private
   */
  private subscriptions: Subscription[] = [];

  constructor(private flightOfferService: FlightOffersService, private _snackBar: MatSnackBar) {
    this.showMore$ = this.showMoreSubject.asObservable();
    this.flights$ = flightOfferService.flightOffers$.pipe(
      combineLatestWith(this.showMore$),
      map(([flightOffers, showMore]) => {
        if (!showMore && !!flightOffers) {
          return flightOffers.slice(0, 5);
        }
        return flightOffers;
      })
    );
    this.isLoading$ = flightOfferService.isLoading$;
    this.subscriptions.push(
      this.manageNoFlightError(),
      this.selectFirstFlightItem()
    );
  }

  public ngOnDestroy(): void {
    // Remove all the subscriptions for performances
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  /**
   * Switch to show less display if the show more button was shown.
   * Else, will display the show more button.
   */
  public toggleShowMore() {
    this.showMoreSubject.next(!this.showMoreSubject.getValue());
  }

  /**
   * Update selected item and propagate the information to the parent
   *
   * @param flightSelection
   */
  public selectItem(flightSelection: FlightOffer) {
    this.selectedItem = flightSelection;
    this.flightSelection.emit(flightSelection);
  }

  /**
   * Listen to all the flight loaded and trigger a no flight found message in case of no availabilities
   *
   * @return Subscription to the flight and loading streams.
   * It should be cleared when the component is destroyed to avoid performance issues.
   *
   * @private
   */
  private manageNoFlightError() {
    return this.flights$.pipe(
      combineLatestWith(this.isLoading$),
      filter(([flights, loading]) => !loading && !flights?.length)
    ).subscribe(() => this._snackBar.open('No flight found for this route', 'Understood'));
  }

  /**
   * Listen to flight loaded and pre-select the first item.
   *
   * @return Subscription to the flights stream.
   * It should be cleared when the component is destroyed to avoid performance issues.
   * @private
   */
  private selectFirstFlightItem() {
    return this.flights$.pipe(
      filter((flights) => !!flights && flights.length > 0),
    ).subscribe((flights) => this.selectItem(flights![0]));
  }
}
