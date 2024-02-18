import { createAction, props } from '@ngrx/store';

import { IUserWithoutPass } from '../../core/interfaces/user.interface';

export const getUser = createAction('[User] Get user info');
export const getUserSuccess = createAction(
  '[User] Get user success',
  props<{ user: IUserWithoutPass }>()
);
export const getUserFailure = createAction(
  '[User] Get user failure',
  props<{ error: string }>()
);
