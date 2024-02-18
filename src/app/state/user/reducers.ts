import { createReducer, on } from '@ngrx/store';

import * as UserActions from './actions';
import { IUserState } from '../index';

export const initialUserState: IUserState = {
  isLoading: false,
  user: null,
  error: null,
};

export const userReducers = createReducer(
  initialUserState,
  on(UserActions.getUser, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(UserActions.getUserSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    user: action.user,
  })),
  on(UserActions.getUserFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  }))
);
