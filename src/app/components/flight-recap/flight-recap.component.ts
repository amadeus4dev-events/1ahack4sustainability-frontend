import { ExtendedPrice, Itineraries } from '@amadeus/self-service-sdk-v2';
import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { utils } from '@dapi/sdk-core';
import { GreenMilesService } from '../../services/green-miles';

/**
 * Component that display the basic information related to itinerary
 * It only contains general information valid to the whole flight and
 * will not details each segment of the flight if there are any stops.
 *
 * To display more information, use the {@link FlightDetailsComponent}
 */
@Component({
  selector: 'app-flight-recap',
  templateUrl: './flight-recap.component.html',
  styleUrls: ['./flight-recap.component.scss'],

})
export class FlightRecapComponent implements OnInit {

  /**
   * Number of stop in the itinerary
   */
  public stopNumber?: number;
  /**
   * Time between the departure and arrival
   */
  public duration?: string;
  /**
   * Departure date time
   */
  public departureDate?: utils.Date;
  /**
   * Arrival date time
   */
  public arrivalDate?: utils.Date;
  /**
   * Iata code of the departure airport
   */
  public departureCode?: string;
  /**
   * Iata code of the arrival airport
   */
  public arrivalCode?: string;
  /**
   * Green miles credit if the user selects this flight
   */
  public greenMiles?: number;

  /**
   * Emits when the user click on the card
   */
  @Output()
  public selection: EventEmitter<void> = new EventEmitter<void>();

  /**
   * Price for the offer
   */
  @Input()
  public price?: ExtendedPrice;

  /**
   * Is the flight selected.
   * If true, the highlight class is added to the host
   */
  @Input()
  @HostBinding('class.highlight')
  public selected: boolean = false;

  constructor(private greenMilesService: GreenMilesService) {
  }

  /**
   * Compute the departure and arrival data from the itinerary segment
   * Set all the itinerary related properties
   *
   * @param itinerary
   */
  @Input()
  public set itinerary(itinerary: Itineraries) {
    const departure = itinerary.segments[0].departure!;
    const arrival = itinerary.segments[itinerary.segments.length - 1]!.arrival!;
    this.stopNumber = itinerary.segments.length - 1;
    this.departureCode = departure.iataCode;
    this.arrivalCode = arrival.iataCode;
    this.departureDate = new utils.Date(departure.at!);
    this.arrivalDate = new utils.Date(arrival!.at!);
    this.duration = itinerary.duration;
    this.greenMiles = this.greenMilesService.computeGreenMiles(itinerary);
  }

  ngOnInit(): void {
  }
}
