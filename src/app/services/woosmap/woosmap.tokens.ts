import {InjectionToken} from "@angular/core";

export interface WoosmapConfig {
  apiKey: string;
}

export const WOOSMAP_CONFIG_TOKEN = new InjectionToken<WoosmapConfig>('Woosmap Config Token');
