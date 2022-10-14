import { InjectionToken } from '@angular/core';

export interface RailKitApiManagerConfig {
  organization:string;
  userId:string;
  officeID:string;
  password: string;
}

export const RAILKIT_API_MANAGER_CONFIG_TOKEN = new InjectionToken<RailKitApiManagerConfig>('RailKit Api Manager Config Token');
