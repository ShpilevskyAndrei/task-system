import { Injectable } from '@angular/core';

import { BehaviorSubject, map } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
  providedIn: 'root',
})
export class ProgressBarStateService {
  private _spinnerState$: BehaviorSubject<number> = new BehaviorSubject<number>(
    0
  );

  public getSpinnerState(): Observable<boolean> {
    return this._spinnerState$.asObservable().pipe(map((e: number) => !!e));
  }

  public setSpinnerState(value: number): void {
    return this._spinnerState$.next(value);
  }

  public showSpinner(): void {
    this.setSpinnerState(this._spinnerState$.value + 1);
  }

  public hideSpinner(): void {
    this.setSpinnerState(this._spinnerState$.value - 1);
  }

  public destroySpinner(): void {
    this.setSpinnerState(0);
  }
}
