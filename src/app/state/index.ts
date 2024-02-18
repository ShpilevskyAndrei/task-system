import { ActionReducerMap } from '@ngrx/store';

import { userReducers } from './user/reducers';
import { usersReducers } from './users/reducers';
import { tasksReducers } from './tasks/reducers';
import { IUserWithoutPass } from '../core/interfaces/user.interface';
import { ITask } from '../features/dashboard/pages/tasks/interfaces/task.interface';
import { UserEffects } from './user/effects';
import { UsersEffects } from './users/effects';
import { TasksEffects } from './tasks/effects';

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

export interface ITasksState {
  isLoading: boolean;
  tasks: ITask[] | null;
  error: string | null;
}

export interface IAppState {
  user: IUserState;
  users: IUsersState;
  tasks: ITasksState;
}

export const reducers: ActionReducerMap<IAppState> = {
  user: userReducers,
  users: usersReducers,
  tasks: tasksReducers,
};

export const effects = [UserEffects, UsersEffects, TasksEffects];
