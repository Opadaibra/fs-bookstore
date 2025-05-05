import { ApplicationConfig, importProvidersFrom, NgModule, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ApiModule } from './api/api.module';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true })
    , provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(), // HttpClient for API calls
    importProvidersFrom(
      NgModule,
      ApiModule.forRoot({ rootUrl: 'http://localhost:8000/api' }) // Django API base URL
    ),
    provideAnimations(),
    provideToastr(),
  ]
};
