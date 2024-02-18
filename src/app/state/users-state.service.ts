//TODO, Remove file after adding NgRx
import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { IUserWithoutPass } from '../core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UsersStateService {
  private _usersSub = new BehaviorSubject<IUserWithoutPass[] | null>(null);

  public getUsersInfo(): Observable<IUserWithoutPass[] | null> {
    return this._usersSub.asObservable();
  }

  public setUsersInfo(usersInfo: IUserWithoutPass[] | null): void {
    this._usersSub.next(usersInfo);
  }

  public getUserById(id: string): Observable<IUserWithoutPass | null> {
    return this.getUsersInfo().pipe(
      map((users: IUserWithoutPass[] | null): IUserWithoutPass | null => {
        if (!users) return null;

        return (
          users.find((user: IUserWithoutPass): boolean => user.id === id) ||
          null
        );
      })
    );
  }
}
