import { AircraftEntry, CarrierEntry, FlightEndPoint } from '@amadeus/self-service-sdk-v1';
import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { FlightOffersService } from '../../services/flight-offers';

/**
 * Component to display the detailed information of a segment of the whole itinerary.
 */
@Component({
  selector: 'app-segment-details',
  templateUrl: './segment-details.component.html',
  styleUrls: ['./segment-details.component.scss']
})
export class SegmentDetailsComponent implements OnInit {

  /**
   * Arrival information of the previous segment if it exists
   */
  @Input()
  public previousArrival?: FlightEndPoint;

  /**
   * Departure information of the next segment if it exists
   */
  @Input()
  public nextDeparture?: FlightEndPoint;

  /**
   * Segment arrival
   */
  @Input()
  public arrival?: FlightEndPoint;

  /**
   * Segment departure
   */
  @Input()
  public departure?: FlightEndPoint;

  /**
   * Duration of the segment
   */
  @Input()
  public duration?: string;

  /**
   * Code of the airline who operates the flight
   */
  @Input()
  public airlineCode?: string;

  /**
   * Code of the aircraft of the segment
   */
  @Input()
  public aircraftCode?: string;

  constructor(public flightOffersService: FlightOffersService) {}

  ngOnInit(): void {
  }

}
