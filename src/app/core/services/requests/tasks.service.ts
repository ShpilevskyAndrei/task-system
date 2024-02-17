import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RequestService } from './@request.service';
import { ITask } from '../../interfaces/task.interface';
import { API, ENDPOINTS } from '../../constants/endpoints';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly _httpService = inject(RequestService);

  public getTaskList(): Observable<ITask[] | null> {
    return this._httpService
      .get<ITask[]>(API, ENDPOINTS.tasks['getTaskList'])
      .pipe(
        map((tasks: ITask[]): ITask[] | null => {
          if (!tasks || !tasks.length) return null; //TODO. Show: no tasks

          return tasks;
        })
      );
  }

  public getTaskById(taskId: string): Observable<ITask | null> {
    return this._httpService.get<ITask[]>(API, ENDPOINTS.tasks['getTask']).pipe(
      map((tasks: ITask[]): ITask | null => {
        if (!tasks || !tasks.length) return null; //TODO. Show: no tasks

        const task: ITask | undefined = tasks.find((task: ITask) => {
          return (task.userId = taskId);
        });

        if (!task) return null;

        return task;
      })
    );
  }

  public createTask(task: ITask): Observable<ITask | null> {
    return this._httpService
      .get<ITask[]>(API, ENDPOINTS.tasks['createTask'])
      .pipe(
        map((tasks: ITask[]): ITask | null => {
          if (!tasks || !tasks.length) return null; //TODO. Show: no tasks

          task.id = (tasks.length + 1).toString();

          return task;
        })
      );
  }

  public deleteTaskById(taskId: string): Observable<boolean | null> {
    return this._httpService
      .get<ITask[]>(API, ENDPOINTS.tasks['deleteTask'])
      .pipe(
        map((tasks: ITask[] | null): boolean | null => {
          if (!tasks || !tasks.length) return null; //TODO. Show: no tasks

          const task: ITask | undefined = tasks.find((task: ITask) => {
            return (task.userId = taskId);
          });

          if (!task) return null; //Can't delete because there are no such task

          return true;
        })
      );
  }
}
