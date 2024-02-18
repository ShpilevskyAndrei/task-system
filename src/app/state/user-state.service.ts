//TODO, Remove file after adding NgRx
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { IUserWithoutPass } from '../core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private _userSub = new BehaviorSubject<IUserWithoutPass | null>(null);

  public getUserInfo(): Observable<IUserWithoutPass | null> {
    return this._userSub.asObservable();
  }

  public setUserInfo(userInfo: IUserWithoutPass | null): void {
    this._userSub.next(userInfo);
  }
}
