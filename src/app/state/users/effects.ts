import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import * as UsersActions from './actions';
import { UserService } from '../../core/services/requests/user.service';
import { IUserWithoutPass } from '../../core/interfaces/user.interface';
import { IResponse } from '../../core/interfaces/response.interface';

@Injectable()
export class UsersEffects {
  private _actions$ = inject(Actions);
  private _userService = inject(UserService);

  getUsers$ = createEffect(() =>
    this._actions$.pipe(
      ofType(UsersActions.getUsers),
      mergeMap(() => {
        return this._userService.getUserList().pipe(
          map((response: IResponse<IUserWithoutPass[]>) =>
            UsersActions.getUsersSuccess({ users: response.data! })
          ),
          catchError((error) =>
            of(UsersActions.getUsersFailure({ error: error.message }))
          )
        );
      })
    )
  );
}
