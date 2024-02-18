import { inject, Injectable } from '@angular/core';

import { map, Observable } from 'rxjs';

import { RequestService } from './@request.service';
import { ITask } from '../../../features/dashboard/pages/tasks/interfaces/task.interface';
import { API, ENDPOINTS } from '../../constants/endpoints';
import { IResponse } from '../../interfaces/response.interface';
import { TasksControllerService } from '../../../../assets/mock/controllers/tasks-controller.service';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly _httpService = inject(RequestService);
  private readonly _tasksController = inject(TasksControllerService);

  public getTaskList(): Observable<IResponse<ITask[]>> {
    return this._httpService
      .get<ITask[]>(API, ENDPOINTS.tasks['getTaskList'])
      .pipe(
        map((tasks: ITask[]): IResponse<ITask[]> => {
          return this._tasksController.getTaskListControl(tasks);
        })
      );
  }

  public createTask(task: ITask): Observable<IResponse<ITask>> {
    return this._httpService
      .post<ITask[]>(API, ENDPOINTS.tasks['createTask'], [task])
      .pipe(
        map((): IResponse<ITask> => {
          return this._tasksController.createTaskControl(task);
        })
      );
  }

  public deleteTaskById(taskId: string): Observable<IResponse<boolean>> {
    return this._httpService
      .delete<ITask[]>(API, ENDPOINTS.tasks['deleteTask'])
      .pipe(
        map((): IResponse<boolean> => {
          return this._tasksController.deleteTaskByIdControl(taskId);
        })
      );
  }
}
