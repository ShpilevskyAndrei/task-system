import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { progressBarInterceptor } from './core/interceptors/progress-bar.interceptor';
import { effects, reducers } from './state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([progressBarInterceptor])),
    provideStore(reducers),
    provideEffects(...effects),
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
  ],
};
