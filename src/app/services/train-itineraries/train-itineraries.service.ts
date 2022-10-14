import {Inject, Injectable} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { RailKitApiManagerConfig, RAILKIT_API_MANAGER_CONFIG_TOKEN } from './train-itineraries.tokens';

export interface TrainItinerariesResponse {
  data: {
    id: string,
    itineraries: itinerary[]
  }
}

export interface itinerary {
  origin:{
    name:string
  },
  destination:{
    name:string
  },
  departureDateTime: Date, 
  arrivalDateTime: Date
  
}

@Injectable({
  providedIn: 'root'
})
export class TrainItinerariesService {

  constructor(@Inject(RAILKIT_API_MANAGER_CONFIG_TOKEN) private railKitApiConfig: RailKitApiManagerConfig) {
  }
 
  /**
   * API call to retrieve train itineraries
   */
   public async getTrainItineraries(origin: string, destination: string) {
    const time = new Date().toISOString();
    //Compute the needed authorization token.
    //All credentials details are set in app.config.ts
    //More deatils in documentation: https://github.com/amadeus4dev-events/Developer-guide/blob/main/RailkitApi/README.md 
    //and in https://github.com/amadeus4dev-events/Developer-guide/blob/main/RailkitApi/1AAuth.docx
    const http1AAuth=this.compute1aAuth(this.railKitApiConfig.userId,this.railKitApiConfig.password, 
      this.railKitApiConfig.organization,this.createNonce(16),this.railKitApiConfig.officeID, time)
    
    //Call Railkit API in order to search for itineraries
    //Below example is hardcoding the origin (8727100 =Paris), detination (7015550 = London) and departure  (2022-10-16T10:33:00)
    //Details about the API in https://github.com/amadeus4dev-events/Developer-guide/blob/main/RailkitApi/README.md
    const response = await fetch('/RailKitAPI/1ASIUMOBSBBU/rail/v1/itineraries/search', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Authorization': '1AAuth ' + http1AAuth,
        'x-1a-replyoptions': 'NoCache',
        'Ama-Client-Ref': 'YOURTEAMNAME', //TODO put your team  name here
        'Cache-Control': 'no-cache',
        'Host': 'noded1.test.api.amadeus.com',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      },
      body: JSON.stringify({
        "searchCriteria" : {
        "distributor" : "SBB", //Keep SBB
        "language" : "EN",   //Keep EN 
        "origin" : "8727100",   //TODO use input value
        "destination" : "7015550", //TODO use input values
        "dateTime" : {
        "departure" : "2022-10-16T10:33:00"   //TODO use input values
        },
        "journeyOptions" : {
        "outboundOptions" : {
        "numberOfItinerariesBefore" : 1,
        "numberOfItinerariesAfter" : 5
        },
        "withBike" : false
        }
        }
        })
    });
    //NOTICE: here we are not targetting the amadeus server (noded1.test.api.amadeus.com) directly. 
    //the call to noded1.test.api.amadeus.com should be done in your local server and not by your browser
    //In Angular it is achieved thanks to a proxy. See proxconfig.json for the mapping between RailKitAPI and noded1.test.api.amadeus.com
    //Reference: https://dev-academy.com/angular-cors/ 



    const responseBody = await response.json();
    //console.log(responseBody);
    return responseBody;
}

/**
 * Calculate a one-time nonce of the given length.
 * @param length of the nonce
 * @returns {*|string} Base 64 encoded nonce of the given length
 */
createNonce(length : number) {
  const s = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const nonce = Array(length).join().split(',').map(() => {
      return s.charAt(Math.floor(Math.random() * s.length));
    }
  ).join('');
  const nonceB64 = btoa(nonce);

  return nonceB64;
}

/**
 *
 * @param login  LSS login - {string}
 * @param pwd LSS user pwd - {string}
 * @param org LSS org - {string}
 * @param nonce Nonce as per LSS salting algo defined - {string}
 * @param time ISO Date - {string}
 * @returns Base64 encoded 1AAUTH token - {string}
 */
compute1aAuth(login: string, pwd : string, org : string, nonce : string, officeId : string, time : string) {
  if(pwd == "ASKFORPWD"){
    console.error("ERROR: Password not set: Ask your Rail mentors to get it. And update train-itineraries.service.ts accordingly");
    return "";
  }
  const saltedPwd = this.computeSaltedPwd(pwd, nonce, time);
  const token = {
    userId: login,
    organization : org,
    nonce,
    timestamp: time,
    officeId,
    password: saltedPwd
  };
  const stringifieldToken = btoa(JSON.stringify(token));
  //console.log(JSON.stringify(token));
  return stringifieldToken;
}

/**
 * @password as string,
 * @nonce as string,
 * @time as string
 * @return salted password in base64
 */
computeSaltedPwd(password : string, nonceb64 : string, timestamp: string)  {
  const nonceWordArray = CryptoJS.enc.Base64.parse(nonceb64);
  const timestampWordArray = CryptoJS.enc.Utf8.parse(timestamp);
  const passwordHashWordArray = CryptoJS.SHA1(CryptoJS.enc.Utf8.parse(password));
  const wordArray = nonceWordArray.concat(timestampWordArray).concat(passwordHashWordArray);
  const token = CryptoJS.enc.Base64.stringify(CryptoJS.SHA1(wordArray));
  return token;
}



}
