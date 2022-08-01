import { ModuleWithProviders, NgModule } from '@angular/core';
import { ApiManager } from './api-manager.service';
import { API_MANAGER_CONFIG_TOKEN, ApiManagerConfig } from './api-manager.tokens';

// Module that needs to be imported by the application to instantiate an SDK configuration.
@NgModule()
export class ApiManagerModule {
  /**
   * Provide a custom apiManager
   * A factory can be provided via injection to the token API_TOKEN
   *
   * @param apiManagerConfig
   */
  public static forRoot(apiManagerConfig: ApiManagerConfig): ModuleWithProviders<ApiManagerModule> {
    return {
      ngModule: ApiManagerModule,
      providers: [
        {provide: API_MANAGER_CONFIG_TOKEN, useValue: apiManagerConfig},
        {provide: ApiManager, deps: [API_MANAGER_CONFIG_TOKEN]}
      ]
    };
  }
}
