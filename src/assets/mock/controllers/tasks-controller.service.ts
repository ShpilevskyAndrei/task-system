import { inject, Injectable } from '@angular/core';

import { IResponse } from '../../../app/core/interfaces/response.interface';
import { ITask } from '../../../app/features/dashboard/pages/tasks/interfaces/task.interface';
import { TokenChecker } from '../helpers/token-checker.service';

@Injectable({ providedIn: 'root' })
export class TasksControllerService {
  private readonly _tokenChecker = inject(TokenChecker);

  public getTaskListControl(tasks: ITask[]): IResponse<ITask[]> {
    const response: IResponse<ITask[]> = { status: 'error' };

    if (this._tokenChecker.isAccessTokenExist<ITask[]>(response).errorMessage)
      return response;

    if (!tasks || !tasks.length) {
      response.errorMessage =
        'Что-то пошло не так. Попробуйте перезагрузить страницу.';

      return response;
    }

    response.data = tasks;

    return response;
  }

  public deleteTaskByIdControl(taskId: string): IResponse<boolean> {
    const response: IResponse<boolean> = { status: 'error' };

    if (this._tokenChecker.isAccessTokenExist<boolean>(response).errorMessage)
      return response;

    response.data = true;

    return response;
  }

  public createTaskControl(task: ITask): IResponse<ITask> {
    const response: IResponse<ITask> = { status: 'error' };

    if (this._tokenChecker.isAccessTokenExist<ITask>(response).errorMessage)
      return response;

    task.id = Math.floor(Math.random() * 1000000).toString();
    response.data = task;

    return response;
  }
}
