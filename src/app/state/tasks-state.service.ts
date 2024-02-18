import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { ITask } from '../features/dashboard/pages/tasks/interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TasksStateService {
  private _tasksSub = new BehaviorSubject<ITask[]>([]);
  private _sortDirectionSub = new BehaviorSubject<'increase' | 'reduce'>(
    'reduce'
  );

  public getTasks(): Observable<ITask[]> {
    return this._tasksSub.asObservable();
  }

  public setTasks(tasks: ITask[]): void {
    this._tasksSub.next(tasks);
  }

  public setAndSortTasks(tasks: ITask[]): void {
    this.setTasks(tasks);
    this.sortTasks(this._sortDirectionSub.getValue());
  }

  public getSortDirection(): Observable<'increase' | 'reduce'> {
    return this._sortDirectionSub.asObservable();
  }

  public setSortDirection(sortDirection: 'increase' | 'reduce'): void {
    this._sortDirectionSub.next(sortDirection);
  }

  constructor() {
    this._sortDirectionSub
      .subscribe((sortDirection: 'increase' | 'reduce'): void => {
        this.sortTasks(sortDirection);
      });
  }

  private sortTasks(sort: 'increase' | 'reduce'): void {
    const tasks: ITask[] = this._tasksSub.getValue();

    const sortedTasks: ITask[] = [...tasks].sort(
      (a: ITask, b: ITask): number => {
        const dateA: number = new Date(a.date).getTime();
        const dateB: number = new Date(b.date).getTime();
        return sort === 'increase' ? dateA - dateB : dateB - dateA;
      }
    );

    this.setTasks(sortedTasks);
  }

  public addTask(task: ITask): void {
    const currentTasks: ITask[] = this._tasksSub.getValue();
    const updatedTasks: ITask[] = [task, ...currentTasks];
    this._tasksSub.next(updatedTasks);
    this.sortTasks(this._sortDirectionSub.getValue());
  }
}
