import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RequestService } from './@request.service';
import { IUser, IUserWithoutPass } from '../../interfaces/user.interface';
import { API, ENDPOINTS } from '../../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _httpService = inject(RequestService);

  public getUserInfoByEmail(
    email: string
  ): Observable<IUserWithoutPass | null> {
    return this._httpService
      .get<IUser[]>(API, ENDPOINTS.users['getUserInfo'])
      .pipe(
        map((users: IUser[]): IUserWithoutPass | null => {
          if (!users || !users.length) return null; //TODO. Handle error (such user doesn't exist)

          const user: IUser | undefined = users.find(
            (user: IUser): boolean => user.email === email
          );

          if (!user) return null; //TODO. Handle error (suh user doesn't exist)

          delete user.password;

          return user;
        })
      );
  }

  public getUserList(): Observable<IUserWithoutPass[] | null> {
    return this._httpService
      .get<IUser[]>(API, ENDPOINTS.users['getUserList'])
      .pipe(
        map((users: IUser[]): IUserWithoutPass[] | null => {
          if (!users || !users.length) return null; //TODO. Handle error (such user doesn't exist)

          users.forEach((user: IUser): void => {
            delete user.password;
          });

          return users;
        })
      );
  }
}
