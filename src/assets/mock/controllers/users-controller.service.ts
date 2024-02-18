import { inject, Injectable } from '@angular/core';

import {
  IUser,
  IUserWithoutPass,
} from '../../../app/core/interfaces/user.interface';
import { IResponse } from '../../../app/core/interfaces/response.interface';
import { AccessTokenStorageService } from '../../../app/core/services/storage.service';
import { TokenChecker } from '../helpers/token-checker.service';

@Injectable({ providedIn: 'root' })
export class UsersControllerService {
  public readonly _tokenChecker = inject(TokenChecker);
  public readonly _accessTokenStorageService = inject(
    AccessTokenStorageService
  );

  public getUserInfoControl(users: IUser[]): IResponse<IUserWithoutPass> {
    const response: IResponse<IUserWithoutPass> = { status: 'error' };

    if (
      this._tokenChecker.isAccessTokenExist<IUserWithoutPass>(response)
        .errorMessage
    )
      return response;

    if (!users || !users.length) {
      response.errorMessage =
        'Что-то пошло не так. Попробуйте перезагрузить страницу.';

      return response;
    }

    const user: IUser | undefined = users.find(
      (user: IUser): boolean =>
        user.email === this._accessTokenStorageService.getItem()
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

    if (
      this._tokenChecker.isAccessTokenExist<IUserWithoutPass[]>(response)
        .errorMessage
    )
      return response;

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
