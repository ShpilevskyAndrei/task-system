import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { catchError, delay, Observable, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProgressBarStateService } from '../services/progress-bar-state.service';
import { generateRandomDelay } from '../../../assets/mock/helpers/random-delay';

export const progressBarInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const progressBarService = inject(ProgressBarStateService);

  progressBarService.showSpinner();

  return next(req).pipe(
    delay(generateRandomDelay()), // response delay imitation
    catchError((error) => {
      progressBarService.hideSpinner();
      return throwError(() => error);
    }),
    finalize((): void => {
      progressBarService.hideSpinner();
    })
  );
};
