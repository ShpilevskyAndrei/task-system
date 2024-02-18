import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SortDirectionService {
  private _sortDirectionSub = new BehaviorSubject<'increase' | 'reduce'>(
    'reduce'
  );

  public getSortDirectionValue(): 'increase' | 'reduce' {
    return this._sortDirectionSub.getValue();
  }

  public getSortDirection(): Observable<'increase' | 'reduce'> {
    return this._sortDirectionSub.asObservable();
  }

  public setSortDirection(sortDirection: 'increase' | 'reduce'): void {
    this._sortDirectionSub.next(sortDirection);
  }
}
