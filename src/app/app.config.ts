import { ApiManagerConfig } from "./services/api-manager";
import { WoosmapConfig } from "./services/woosmap/woosmap.tokens";
import { RailKitApiManagerConfig } from "./services/train-itineraries/train-itineraries.tokens";


// Configuration to connect to the Amadeus API
export const amadeusApiConfig: ApiManagerConfig = {
  gatewayUrl: 'https://test.api.amadeus.com/v1/security/oauth2',
  // TODO How to find your credentials: https://developers.amadeus.com/register
  gatewayClientId: 'YOUR_API_KEY',
  gatewayClientPrivate: 'YOUR_API_SECRET',
  

  // Test API
  maximumConcurrentCalls: 1,
  delayBetweenRequests: 200,
  numberOfRetries: 2,
  sleepBetweenRetries: 1000
}

export const railKitApiConfig: RailKitApiManagerConfig =
{
  organization:"'RAIL-SBB'",
  userId:"USSBBRAILK",
  officeID:"BRN2S78AG",
  password : 'ASKFORPWD' //TODO ask your rail mentors  for the password
}

// Configuration to connect to Woosmap API
export const woosmapApiConfig: WoosmapConfig = {
  // TODO: more information about how to get your key: https://developers.woosmap.com/get-started/#before-you-start
  apiKey: 'YOUR_WOOSMAP_KEY'
}
