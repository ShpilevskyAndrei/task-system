import { inject, Injectable } from '@angular/core';

import {
  IUser,
  IUserWithoutPass,
} from '../../../app/core/interfaces/user.interface';
import { IResponse } from '../../../app/core/interfaces/response.interface';
import { AccessTokenStorageService } from '../../../app/core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class UserHelper {
  public _accessTokenStorageService = inject(AccessTokenStorageService);

  public getUserInfoControl(users: IUser[]): IResponse<IUserWithoutPass> {
    const response: IResponse<IUserWithoutPass> = { status: 'error' };

    const token: string | null = this._accessTokenStorageService.getItem();

    if (!token) {
      response.errorMessage =
        'Срок доступа к личному кабинету истек. Пожалуйста, авторизуйтесь заново';

      return response;
    }

    if (!users || !users.length) {
      response.errorMessage =
        'Что-то пошло не так. Попробуйте перезагрузить страницу.';

      return response;
    }

    const user: IUser | undefined = users.find(
      (user: IUser): boolean => user.email === token
    );

    if (!user) {
      response.errorMessage =
        'Срок доступа к личному кабинету истек. Пожалуйста, авторизуйтесь заново';

      return response;
    }

    delete user.password;

    response.data = user;

    return response;
  }

  public getUserListControl(
    users: IUserWithoutPass[]
  ): IResponse<IUserWithoutPass[]> {
    const response: IResponse<IUserWithoutPass[]> = { status: 'error' };

    const token: string | null = this._accessTokenStorageService.getItem();

    if (!token) {
      response.errorMessage =
        'Срок доступа к личному кабинету истек. Пожалуйста, авторизуйтесь заново';

      return response;
    }

    if (!users || !users.length) {
      response.errorMessage =
        'Что-то пошло не так. Попробуйте перезагрузить страницу.';

      return response;
    }

    users.forEach((user: IUser): void => {
      delete user.password;
    });

    response.data = users;

    return response;
  }
}
