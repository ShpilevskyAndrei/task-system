import { inject, Injectable } from '@angular/core';

import { IResponse } from '../../../app/core/interfaces/response.interface';
import { AccessTokenStorageService } from '../../../app/core/services/storage.service';

@Injectable({ providedIn: 'root' })
export class TokenChecker {
  public _accessTokenStorageService = inject(AccessTokenStorageService);

  public isAccessTokenExist<T>(response: IResponse<T>): IResponse<T> {
    const token: string | null = this._accessTokenStorageService.getItem();

    if (!token) {
      response.errorMessage =
        'Срок доступа к личному кабинету истек. Пожалуйста, авторизуйтесь заново';
    }

    return response;
  }
}
