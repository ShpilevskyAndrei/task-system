//TODO, Remove file after adding NgRx
import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { IUserWithoutPass } from '../core/interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private _userInfo = new BehaviorSubject<IUserWithoutPass | null>(null);

  public getUserInfo(): Observable<IUserWithoutPass | null> {
    return this._userInfo.asObservable();
  }

  public setUserInfo(userInfo: IUserWithoutPass | null): void {
    this._userInfo.next(userInfo);
  }
}
