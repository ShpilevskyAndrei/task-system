//TODO, Remove file after adding NgRx
import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { IUserWithoutPass } from '../core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UsersStateService {
  private _usersInfo = new BehaviorSubject<IUserWithoutPass[] | null>(null);

  public getUsersInfo(): Observable<IUserWithoutPass[] | null> {
    return this._usersInfo.asObservable();
  }

  public setUsersInfo(usersInfo: IUserWithoutPass[] | null): void {
    this._usersInfo.next(usersInfo);
  }

  public getUserById(id: string): Observable<IUserWithoutPass | undefined> {
    return this.getUsersInfo().pipe(
      map((users: IUserWithoutPass[] | null) => {
        if (!users) return undefined;
        return users.find((user: IUserWithoutPass) => user.id === id);
      })
    );
  }
}
