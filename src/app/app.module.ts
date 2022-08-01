import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { amadeusApiConfig, woosmapApiConfig } from "./app.config";
import { NavigationComponent } from './components/navigation/navigation.component';
import { ApiManagerModule } from './services/api-manager';
import { WOOSMAP_CONFIG_TOKEN } from "./services/woosmap/woosmap.tokens";

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ApiManagerModule.forRoot(amadeusApiConfig),
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [
    {provide: WOOSMAP_CONFIG_TOKEN, useValue: woosmapApiConfig}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
