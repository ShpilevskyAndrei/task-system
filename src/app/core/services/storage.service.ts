import { Inject, Injectable } from '@angular/core';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../constants/storage-keys';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  public constructor(@Inject('storageKey') private _storageKey: string) {}

  public setItem(value: string): void {
    localStorage.setItem(this._storageKey, value);
  }

  public getItem(): string | null {
    return localStorage.getItem(this._storageKey);
  }

  public removeItem(): void {
    localStorage.removeItem(this._storageKey);
  }

  public clearStorage(): void {
    localStorage.clear();
  }
}

@Injectable({
  providedIn: 'root',
})
export class AccessTokenStorageService extends StorageService {
  public constructor() {
    super(ACCESS_TOKEN_KEY);
  }
}

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenStorageService extends StorageService {
  public constructor() {
    super(REFRESH_TOKEN_KEY);
  }
}
