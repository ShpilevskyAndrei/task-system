import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RequestService } from './@request.service';
import { IUser, IUserWithoutPass } from '../../interfaces/user.interface';
import { API, ENDPOINTS } from '../../constants/endpoints';
import { IResponse } from '../../interfaces/response.interface';
import { UsersControllerService } from '../../../../assets/mock/controllers/users-controller.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _httpService = inject(RequestService);
  private readonly _userHelper = inject(UsersControllerService);

  public getUserInfo(): Observable<IResponse<IUserWithoutPass>> {
    return this._httpService
      .get<IUser[]>(API, ENDPOINTS.users['getUserInfo'])
      .pipe(
        map((users: IUser[]): IResponse<IUserWithoutPass> => {
          return this._userHelper.getUserInfoControl(users);
        })
      );
  }

  public getUserList(): Observable<IResponse<IUserWithoutPass[]>> {
    return this._httpService
      .get<IUser[]>(API, ENDPOINTS.users['getUserList'])
      .pipe(
        map((users: IUser[]): IResponse<IUserWithoutPass[]> => {
          return this._userHelper.getUserListControl(users);
        })
      );
  }
}
