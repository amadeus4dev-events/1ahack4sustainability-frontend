import { GeoCode } from '@amadeus/self-service-sdk-v1';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { utils } from '@dapi/sdk-core';
import { ChangeDatePipe } from '../../pipe/change-date/change-date.pipe';
import { WoosmapService } from "../../services/woosmap/woosmap.service";
import { firstValueFrom } from "rxjs";

/**
 * Component that wraps a map and enhance it with itinerary information (stops, departure and arrival data)
 */
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {
  /**
   * Departure/Arrival points to display on the map
   */
  @Input()
  endPoints!: { departureTime?: utils.DateTime, arrivalTime?: utils.DateTime, coords: GeoCode, iataCode: string }[];

  /**
   * Reference to the Map widget
   * @private
   */
  private map!: woosmap.map.Map;

  /**
   * Graphic markers on the map computed from the endpoints information
   * @private
   */
  private markers: any[] = [];
  /**
   * Graphic lines that represent each flight segment
   * @private
   */
  private polylines: any[] = [];

  constructor(private elementRef: ElementRef, private datePipe: DatePipe, private changeDatePipe: ChangeDatePipe, private woosmapService: WoosmapService) {
  }

  ngAfterViewInit() {
    firstValueFrom(this.woosmapService.map$).then(() => {
      this.initMap();
      this.updateMarkers();
    });
  }

  ngOnChanges() {
    if (this.map) {
      this.updateMarkers();
    }
  }

  /**
   * Instantiate the map, this should be called only once
   */
  private initMap() {
    this.map = new woosmap.map.Map(this.elementRef.nativeElement, {
      center: new woosmap.map.LatLng(43.2, 1.3),
      zoom: 3,
      styles: [
        {
          'featureType': 'water',
          'stylers': [{
            'lightness': 35
          }]
        },
        {
          'elementType': 'labels',
          'stylers': [{
            'visibility': 'off'
          }]
        }
      ],
      disableDefaultUI: true,
      gestureHandling: 'greedy'
    });
  }

  /**
   * Remove all elements from the map
   */
  private reset() {
    this.markers.forEach((m) => m.setMap(null));
    this.polylines.forEach((m) => {
      m.setVisible(false);
      m.setMap(null);
    });
    this.markers = [];
    this.polylines = [];
  }

  /**
   * Get the html code for the SVG that will be used as marker icon
   * This svg will display the index, iata code, departure time if any and arrival time if any
   *
   * @param endPoint
   * @param index
   */
  private getMarkerIconSvg(endPoint: { departureTime?: utils.DateTime, arrivalTime?: utils.DateTime, coords: GeoCode, iataCode: string }, index: number) {
    const textBoxHeight = (endPoint.departureTime && endPoint.arrivalTime) ? 60 : 42;
    const arrowHeight = 20;
    const departureTimeY = endPoint.arrivalTime ? 51 : 33;
    const arrivalTimeY = 33;
    const departureColor = '#1e88e5';
    const arrivalColor = '#43a047';
    const arrivalDayDiff = this.changeDatePipe.transform(this.endPoints[index - 1]?.departureTime, endPoint.arrivalTime);
    const departureDayDiff = this.changeDatePipe.transform(endPoint.arrivalTime, endPoint.departureTime);
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="80px" height="${textBoxHeight + arrowHeight}px">
          <polyline points="0,0 80,0 80,${textBoxHeight} 44,${textBoxHeight} 40,${textBoxHeight + arrowHeight} 36,${textBoxHeight} 0,${textBoxHeight} 0,0" style="fill: #fff; stroke: #999; stroke-width: 2px; opacity: .85"></polyline>
          <g style="font-family: Roboto, sans-serif; font-size: 14px;">
            <text x="6" y="11" style="font-size: 10px; fill: #333; stroke: #333;" text-anchor="middle">${index + 1}</text>
            <text x="50%" y="16" style="fill: #333; stroke: #333" text-anchor="middle">${endPoint.iataCode}</text>
            ${endPoint.arrivalTime ? `
            <text x="5" y="${arrivalTimeY}" style="fill: ${arrivalColor}; stroke: ${arrivalColor}; transform: rotate(35deg); transform-origin: 12px ${arrivalTimeY}px">&#9992;</text>
            <text x="50%" y="${arrivalTimeY}" style="fill: ${arrivalColor}; stroke: ${arrivalColor};" text-anchor="middle">${this.datePipe.transform(endPoint.arrivalTime, 'HH:mm')}</text>
            ${arrivalDayDiff ? `<text x="62" y="${arrivalTimeY - 3}" style="font-size: 10px; fill: #cc0000; stroke: #cc0000;">+${arrivalDayDiff}</text>` : ''}` : ''}
            ${endPoint.departureTime ? `
            <text x="5" y="${departureTimeY}" style="fill: ${departureColor}; stroke: ${departureColor}; transform: rotate(-35deg); transform-origin: 12px ${departureTimeY - 9}px">&#9992;</text>
            <text x="50%" y="${departureTimeY}" style="fill: ${departureColor}; stroke: ${departureColor};" text-anchor="middle">${this.datePipe.transform(endPoint.departureTime, 'HH:mm')}</text>
            ${departureDayDiff ? `<text x="62" y="${departureTimeY - 3}" style="font-size: 10px; fill: #cc0000; stroke: #cc0000;">+${departureDayDiff}</text>` : ''}` : ''}
          </g>
        </svg>`;
  }

  /**
   * Returns an updated set a coordinates using a western point that minimize the total horizontal length
   * This is needed to prevent lines that would wrap around the world
   * Example:
   * let's say we have 3 points
   * - SFO (lat: 37.619, lng: -122.375)
   * - TYO (lat: 35.7647, lng: 140.386)
   * - BLR (lat: 13.1979, lng: 77.7063)
   * If we don't apply any modification, the points will be displayed in that order and a line will be drawn from SFO to TYO from west to east
   * SFO ------> TYO
   *      BLR <--
   *
   * So, in this case we determine that the minimal length would be to use BLR as the western point
   * We then translate all the points that are currently on the west of BLR by adding 360 degrees of longitude, putting them on the east
   * - Bangalore (lat: 13.1979, lng: 77.7063)
   * - Tokyo (lat: 35.7647, lng: 140.386)
   * - San-Francisco (lat: 37.619, lng: 237.625)
   * Now, the path from SFO to TYO will be correctly displayed from east to west
   * BLR <-- TYO <-- SFO
   */
  private getAdjustedCoordinates() {
    let minCumulatedLength = Number.MAX_VALUE;
    let bestAdjustedCoordinates: woosmap.map.LatLng[] = [];
    for (let i = 0; i < this.endPoints.length; i++) {
      // Adjust coordinates by considering the endPoint at index i to be the western point
      const adjustedCoordinates = this.endPoints.map((endPoint) =>
        new woosmap.map.LatLng(endPoint.coords!.latitude!, endPoint.coords!.longitude! + (endPoint.coords!.longitude! < this.endPoints[i].coords!.longitude! ? 360 : 0)));

      const cumulatedLength = adjustedCoordinates.reduce((total, m, index) => total + (index > 0 ? Math.abs(adjustedCoordinates[index].lng() - adjustedCoordinates[index - 1].lng()) : 0), 0);
      if (cumulatedLength < minCumulatedLength) {
        minCumulatedLength = cumulatedLength;
        bestAdjustedCoordinates = adjustedCoordinates;
      }
    }
    return bestAdjustedCoordinates;
  }

  /**
   * Update the position of all endPoints and draw the lines between them
   */
  private updateMarkers() {
    this.reset();
    const adjustedCoordinates = this.getAdjustedCoordinates();
    this.endPoints.forEach((endPoint, index) => {
      const marker = new woosmap.map.Marker({
        position: {lat: adjustedCoordinates[index].lat(), lng: adjustedCoordinates[index].lng()},
        icon: {
          url: `data:image/svg+xml;base64,${btoa(this.getMarkerIconSvg(endPoint, index))}`
        }
      });
      marker.setMap(this.map);
      this.markers.push(marker);
    });
    const polyline = new woosmap.map.Polyline({
      path: adjustedCoordinates,
      strokeColor: '#cc0000',
      strokeOpacity: 0.8,
      strokeWeight: 3,
      geodesic: true
    });
    polyline.setMap(this.map);
    this.polylines.push(polyline);
    this.centerMap();
  }

  /**
   * Center the map to fit all markers in the view
   */
  private centerMap() {
    const bounds = new woosmap.map.LatLngBounds();
    this.markers.forEach((m) => bounds.extend(m.getPosition()!));
    this.map!.fitBounds(bounds, {top: 80, bottom: 5, left: 45, right: 45});
  }
}
