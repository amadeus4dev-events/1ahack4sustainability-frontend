import { Injectable } from '@angular/core';

export interface TrainItinerariesResponse {
  id: string;
}

@Injectable({
  providedIn: 'root'
})
export class TrainItinerariesService {
 
  /**
   * API call to retrieve train itineraries
   */
   public async getTrainItineraries(origin: string, destination: string): Promise<TrainItinerariesResponse> {
    console.log('service');
    fetch('https://noded1.test.api.amadeus.com/1ASIUMOBSBBU/rail/v1/itineraries/search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': '1AAuth eyJ1c2VySWQiOiAiVVNTQkJSQUlMSyIsICJvcmdhbml6YXRpb24iOiAiUkFJTC1TQkIiLCAib2ZmaWNlSWQiOiAiQlJOMlM3OEFHIiwgIm5vbmNlIjogIk16VTJNMkV3TTJFdE56RmtOaTA1TWpnMUxUQTJNell0WkRsaVpEaGxPV1ZpTURnMyIsICJ0aW1lc3RhbXAiOiAiMjAyMi0wOS0yNlQwOTowMDo0My4wMDBaIiwgInBhc3N3b3JkIjogIk5pOW5WYU1oOW1jWjkrRklBYVZrUmtTdjIzND0ifQ==',
        'x-1a-replyoptions': 'NoCache',
        'Ama-Client-Ref': 'bwaag-0000-4711-1234-ffffistesting',
        'Cache-Control': 'no-cache',
        'Host': 'noded1.test.api.amadeus.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Content-Length': '395'
      },
      body: JSON.stringify({
        "searchCriteria" : {
        "distributor" : "SBB",
        "language" : "EN",
        "origin" : "8727100",
        "destination" : "7015550",
        "dateTime" : {
        "departure" : "2022-10-16T10:33:00"
        },
        "journeyOptions" : {
        "outboundOptions" : {
        "numberOfItinerariesBefore" : 0,
        "numberOfItinerariesAfter" : 3
        },
        "withBike" : false
        }
        }
        })
    }).then(res => res.json())
      .then(res => console.log(res));
    return {"id":"test"};
}
}
