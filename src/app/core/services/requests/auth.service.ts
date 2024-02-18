import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { RequestService } from './@request.service';
import { IUser } from '../../interfaces/user.interface';
import { ITokens } from '../../interfaces/tokens.interface';
import { IUserCredentials } from '../../interfaces/user-credentials.interface';
import { API, ENDPOINTS } from '../../constants/endpoints';
import {
  AccessTokenStorageService,
  RefreshTokenStorageService,
} from '../storage.service';
import { AuthControllerService } from '../../../../assets/mock/controllers/auth-controller.service';
import { IResponse } from '../../interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _httpService = inject(RequestService);
  private readonly _accessTokenStorageService = inject(
    AccessTokenStorageService
  );
  private readonly _refreshTokenStorageService = inject(
    RefreshTokenStorageService
  );
  private readonly _authServiceHelper = inject(AuthControllerService);

  private _isAuthorized: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public constructor() {
    this.defineExistingTokens();
  }

  public login(
    loginRequestBody: IUserCredentials
  ): Observable<IResponse<ITokens>> {
    return this._httpService.post<IUser[]>(API, ENDPOINTS.auth['login'], []).pipe(
      map((users: IUser[]): IResponse<ITokens> => {
        const response: IResponse<ITokens> =
          this._authServiceHelper.loginControl(loginRequestBody, users);

        if (response.status === 'success' && response.data) {
          this._accessTokenStorageService.setItem(response.data.accessToken);
          this._refreshTokenStorageService.setItem(response.data.refreshToken);
          this.setIsAuthorized(true);
        }

        return response;
      })
    );
  }

  public logout(): Observable<IResponse<boolean>> {
    return this._httpService
      .post(API, ENDPOINTS.auth['login'], {})
      .pipe(
        map((): IResponse<boolean> => {
          const response: IResponse<boolean> = AuthControllerService.logoutControl();

          if (response.status === 'error' && !response.data) {
            return response;
          }

          this._accessTokenStorageService.removeItem();
          this._refreshTokenStorageService.removeItem();
          //TODO
          this.setIsAuthorized(false);

          return response;
        })
      );
  }

  public getIsAuthorized(): Observable<boolean> {
    return this._isAuthorized.asObservable();
  }

  public setIsAuthorized(isAuth: boolean): void {
    this._isAuthorized.next(isAuth);
  }

  private defineExistingTokens(): void {
    const accessToken: string | null =
      this._accessTokenStorageService.getItem();
    const refreshToken: string | null =
      this._refreshTokenStorageService.getItem();

    if (!!accessToken && !!refreshToken) {
      this.setIsAuthorized(true);
    } else {
      this.setIsAuthorized(false);
    }
  }
}
