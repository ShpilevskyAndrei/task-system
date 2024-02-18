import { createReducer, on } from '@ngrx/store';

import * as TasksActions from './actions';
import { ITasksState } from '../index';

export const initialTasksState: ITasksState = {
  isLoading: false,
  tasks: null,
  error: null,
};

export const tasksReducers = createReducer(
  initialTasksState,
  on(TasksActions.getTasks, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(TasksActions.getTasksSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    tasks: action.tasks,
  })),
  on(TasksActions.getTasksFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(TasksActions.createTask, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(TasksActions.createTaskSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    tasks: [...state.tasks!, action.task],
  })),
  on(TasksActions.createTaskFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  })),
  on(TasksActions.deleteTask, (state) => ({
    ...state,
    isLoading: true,
  })),
  on(TasksActions.deleteTaskSuccess, (state, action) => ({
    ...state,
    isLoading: false,
    tasks: state.tasks
      ? state.tasks.filter((task) => task.id !== action.taskId)
      : null,
  })),
  on(TasksActions.deleteTaskFailure, (state, action) => ({
    ...state,
    isLoading: false,
    error: action.error,
  }))
);
