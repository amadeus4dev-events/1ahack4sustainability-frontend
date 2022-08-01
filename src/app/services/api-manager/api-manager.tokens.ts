import { InjectionToken } from '@angular/core';

export interface ApiManagerConfig {
  gatewayUrl: string;
  gatewayClientId: string;
  gatewayClientPrivate: string;
  maximumConcurrentCalls: number;
  delayBetweenRequests: number;
  numberOfRetries: number;
  sleepBetweenRetries: number;
}

export const API_MANAGER_CONFIG_TOKEN = new InjectionToken<ApiManagerConfig>('Api Manager Config Token');
