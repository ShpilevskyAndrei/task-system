import { createReducer, on } from '@ngrx/store';

import * as UsersActions from './actions';
import { IUsersState } from '../index';

export const initialUsersState: IUsersState = {
  isLoading: false,
  users: null,
  error: null,
};

export const usersReducers = createReducer(
  initialUsersState,
  on(UsersActions.getUsers, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(UsersActions.getUsersSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    users: action.users,
  })),
  on(UsersActions.getUsersFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  }))
);
