//TODO, Remove file after adding NgRx
import { Injectable } from '@angular/core';

import { BehaviorSubject, map, Observable } from 'rxjs';

import { ITask } from '../core/interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TasksStateService {
  private _tasks = new BehaviorSubject<ITask[] | null>(null);

  public getTasks(): Observable<ITask[] | null> {
    return this._tasks.asObservable();
  }

  public setTasks(tasks: ITask[] | null): void {
    this._tasks.next(tasks);
  }

  public getTaskById(id: string): Observable<ITask | undefined> {
    return this.getTasks().pipe(
      map((tasks: ITask[] | null) => {
        if (!tasks) return undefined;
        return tasks.find((task: ITask) => task.id === id);
      })
    );
  }
}
