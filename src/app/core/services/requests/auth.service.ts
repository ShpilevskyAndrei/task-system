import { inject, Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable, of } from 'rxjs';

import { RequestService } from './@request.service';
import { IUser } from '../../interfaces/user.interface';
import { ITokens } from '../../interfaces/tokens.interface';
import { IUserCredentials } from '../../interfaces/user-credentials.interface';
import { API, ENDPOINTS } from '../../constants/endpoints';
import {
  AccessTokenStorageService,
  RefreshTokenStorageService,
} from '../storage.service';

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

  private _isAuthorized: BehaviorSubject<boolean | null> = new BehaviorSubject<
    boolean | null
  >(null);

  public constructor() {
    this.defineExistingTokens();
  }

  public login(loginRequestBody: IUserCredentials): Observable<ITokens | null> {
    return this._httpService.get<IUser[]>(API, ENDPOINTS.auth['login']).pipe(
      map((users: IUser[]): ITokens | null => {
        if (!users || !users.length) return null; //TODO. Handle error (such user doesn't exist)

        const user: IUser | undefined = users.find(
          (user: IUser): boolean => user.email === loginRequestBody.email
        );

        if (!user) return null; //TODO. Handle error (suh user doesn't exist)
        if (user.password !== loginRequestBody.password) return null; //TODO. Handle error (password incorrect)

        const tokens: ITokens = {
          accessToken: 'generated-access-token',
          refreshToken: 'generated-refresh-token',
        };

        this._accessTokenStorageService.setItem(tokens.accessToken);
        this._refreshTokenStorageService.setItem(tokens.refreshToken);

        return tokens;
      })
    );
  }

  public logout(): Observable<boolean> {
    //Send request to BE, after that (if success):
    //TODO. + remove user info from store
    this._accessTokenStorageService.removeItem();
    this._refreshTokenStorageService.removeItem();
    this.setIsAuthorized(false);
    return of(true);
  }

  public getIsAuthorized(): Observable<boolean | null> {
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
