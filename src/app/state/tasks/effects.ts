import { inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import * as TasksActions from './actions';
import { IResponse } from '../../core/interfaces/response.interface';
import { TasksService } from '../../core/services/requests/tasks.service';
import { ITask } from '../../features/dashboard/pages/tasks/interfaces/task.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class TasksEffects {
  private _actions$ = inject(Actions);
  private _tasksService = inject(TasksService);
  private _snackBar = inject(MatSnackBar);

  getTasks$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TasksActions.getTasks),
      mergeMap(() => {
        return this._tasksService.getTaskList().pipe(
          map((response: IResponse<ITask[]>) =>
            TasksActions.getTasksSuccess({ tasks: response.data! })
          ),
          catchError((error) =>
            of(TasksActions.getTasksFailure({ error: error.message }))
          )
        );
      })
    )
  );

  createTask$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TasksActions.createTask),
      mergeMap((action) => {
        return this._tasksService.createTask({ ...action.task }).pipe(
          mergeMap((response: IResponse<ITask>) => {
            this._snackBar.open(
              `Задача '${response.data?.title}' успешно создана`,
              'ОК',
              {
                duration: 3000,
              }
            );

            return of(TasksActions.createTaskSuccess({ task: response.data! }));
          }),
          catchError((error) =>
            of(TasksActions.createTaskFailure({ error: error.message }))
          )
        );
      })
    )
  );

  deleteTask$ = createEffect(() =>
    this._actions$.pipe(
      ofType(TasksActions.deleteTask),
      mergeMap((action) =>
        this._tasksService.deleteTaskById(action.taskId).pipe(
          map((response: IResponse<boolean>) => {
            this._snackBar.open(`Задача успешно удалена`, 'ОК', {
              duration: 3000,
            });

            return TasksActions.deleteTaskSuccess({ taskId: action.taskId });
          }),
          catchError((error) =>
            of(TasksActions.deleteTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
