import { Injectable } from '@angular/core';

import { ITokens } from '../../../app/core/interfaces/tokens.interface';
import { IUser } from '../../../app/core/interfaces/user.interface';
import { IUserCredentials } from '../../../app/core/interfaces/user-credentials.interface';
import { IResponse } from '../../../app/core/interfaces/response.interface';

@Injectable({ providedIn: 'root' })
export class AuthControllerService {
  public loginControl(
    loginRequestBody: IUserCredentials,
    users: IUser[]
  ): IResponse<ITokens> {
    const response: IResponse<ITokens> = { status: 'error' };

    if (!users || !users.length) {
      response.errorMessage =
        'Что-то пошло не так. Попробуйте перезагрузить страницу.';

      return response;
    }

    const user: IUser | undefined = users.find(
      (user: IUser): boolean => user.email === loginRequestBody.email
    );

    if (!user) {
      response.errorMessage = 'Пользователя с такой эл. почтой не существует.';

      return response;
    }

    if (user.password !== loginRequestBody.password) {
      response.errorMessage = 'Неправильный пароль. Попробуйте снова.';

      return response;
    }

    response.status = 'success';
    response.data = {
      accessToken: loginRequestBody.email,
      refreshToken: loginRequestBody.email,
    };

    return response;
  }

  public static logoutControl(): IResponse<boolean> {
    return {
      status: 'success',
      data: true,
    };
  }
}
