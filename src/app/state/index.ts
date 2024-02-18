import { ActionReducerMap } from '@ngrx/store';

import { userReducers } from './user/reducers';
import { IUserWithoutPass } from '../core/interfaces/user.interface';
import { usersReducers } from './users/reducers';

export interface IUserState {
  isLoading: boolean;
  user: IUserWithoutPass | null;
  error: string | null;
}

export interface IUsersState {
  isLoading: boolean;
  users: IUserWithoutPass[] | null;
  error: string | null;
}

export interface IAppState {
  user: IUserState;
  users: IUsersState;
}

export const reducers: ActionReducerMap<IAppState> = {
  user: userReducers,
  users: usersReducers,
};
