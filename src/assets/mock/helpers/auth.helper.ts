import { ITokens } from '../../../app/core/interfaces/tokens.interface';
import { IUser } from '../../../app/core/interfaces/user.interface';
import { IUserCredentials } from '../../../app/core/interfaces/user-credentials.interface';
import { IResponse } from '../../../app/core/interfaces/response.interface';

export abstract class AuthServiceHelper {
  public static loginControl(
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
      accessToken: 'generated-access-token',
      refreshToken: 'generated-refresh-token',
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
