import { Itineraries } from '@amadeus/self-service-sdk-v2';
import { Injectable } from '@angular/core';

/**
 * Service to help you compute Green Miles for a destination
 * Feel free to enhance it with your ideas!
 */
@Injectable({
  providedIn: 'root'
})
export class GreenMilesService {

  /**
   * Green score per destination
   */
  public greenDestinationMap: { [key: string]: number } = {
    'BCN': 40,
    'SFO': 60,
    'BER': 40,
    'TXL': 40,
    'BML': 40,
    'DFW': 60,
    'DAL': 60,
    'ADS': 60,
    'RBD': 60,
    'LON': 120,
    'LHR': 120,
    'LGW': 120,
    'STN': 120,
    'LTN': 120,
    'LCY': 120,
    'LYX': 120,
    'SEN': 120,
    'BQH': 120,
    'BLR': 40,
    'NYC': 80,
    'JFK': 80,
    'EWR': 80,
    'LGA': 80,
    'SWF': 80,
    'NYS': 80,
    'PAR': 50
  }

  /**
   * Compute the green miles for an itinerary.
   * Currently arbitrarily set, feel free to improve it with api integrations
   *
   * @param itinerary
   */
  public computeGreenMiles(itinerary: Itineraries) {
    const destinationCode = itinerary.segments[itinerary.segments.length - 1].arrival!.iataCode!;
    return Math.max((this.greenDestinationMap[destinationCode] || 0) - (itinerary.segments.length - 1) * 20, 0);
  }
}
