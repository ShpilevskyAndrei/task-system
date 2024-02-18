import { createAction, props } from '@ngrx/store';

import { IUserWithoutPass } from '../../core/interfaces/user.interface';

export const getUsers = createAction('[Users] Get users info');
export const getUsersSuccess = createAction(
  '[Users] Get users success',
  props<{ users: IUserWithoutPass[] }>()
);
export const getUsersFailure = createAction(
  '[Users] Get users failure',
  props<{ error: string }>()
);
