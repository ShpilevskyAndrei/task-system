import { createAction, props } from '@ngrx/store';

import { ITask } from '../../features/dashboard/pages/tasks/interfaces/task.interface';

export const getTasks = createAction('[Tasks] Get tasks info');
export const getTasksSuccess = createAction(
  '[Tasks] Get tasks success',
  props<{ tasks: ITask[] }>()
);
export const getTasksFailure = createAction(
  '[Tasks] Get tasks failure',
  props<{ error: string }>()
);

export const createTask = createAction(
  '[Tasks] Create task',
  props<{ task: ITask }>()
);
export const createTaskSuccess = createAction(
  '[Tasks] Create tasks success',
  props<{ task: ITask }>()
);
export const createTaskFailure = createAction(
  '[Tasks] Create tasks failure',
  props<{ error: string }>()
);

export const deleteTask = createAction(
  '[Tasks] Delete task',
  props<{ taskId: string }>()
);
export const deleteTaskSuccess = createAction(
  '[Tasks] Delete task success',
  props<{ taskId: string }>()
);
export const deleteTaskFailure = createAction(
  '[Tasks] Delete tasks failure',
  props<{ error: string }>()
);
