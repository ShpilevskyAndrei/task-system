import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AsyncPipe, DatePipe, NgIf, NgStyle } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { fromEvent, map, Observable, startWith, take } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { ITask } from './interfaces/task.interface';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { IUserWithoutPass } from '../../../../core/interfaces/user.interface';
import { SortDirectionService } from '../../../../state/mock/sort-direction.service';
import { TaskModalComponent } from '../../../../shared/components/task-modal/task-modal.component';
import { TaskPrioritiesEnum } from './enums/task-priorities.enum';
import { UnsubscribeDirective } from '../../../../core/directives/unsubscribe.directive';
import { taskTableColumns } from './consts/task-table-columns';
import { usersSelector } from '../../../../state/users/selectors';
import { tasksSelector } from '../../../../state/tasks/selectors';
import * as TasksActions from '../../../../state/tasks/actions';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderRow,
    MatRow,
    MatPaginator,
    MatNoDataRow,
    MatRowDef,
    MatHeaderRowDef,
    MatCellDef,
    MatHeaderCellDef,
    DatePipe,
    DateFormatPipe,
    AsyncPipe,
    NgIf,
    NgStyle,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent
  extends UnsubscribeDirective
  implements OnInit, AfterViewInit
{
  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null;

  private windowHeight: number = window.innerHeight;
  private readonly _sortDirectionService = inject(SortDirectionService);
  private readonly _dialog = inject(MatDialog);
  private readonly _store = inject(Store);

  public columns: string[] = taskTableColumns;
  public dataSource!: MatTableDataSource<ITask>;
  public tasks$?: Observable<ITask[] | null>;
  public pageSize: number = this.calculatePageSize();
  public users: IUserWithoutPass[] | null = null;
  public sortDirection$: Observable<'increase' | 'reduce'> =
    this._sortDirectionService.getSortDirection();

  public ngOnInit(): void {
    this.getTasks();
    this.getUsers();
    this.trackSortDirection();
    this.trackPageSize();
  }

  public ngAfterViewInit(): void {
    if (this.paginator && this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  public getUserInfoById(id: string): IUserWithoutPass | undefined {
    return this.users?.find(
      (user: IUserWithoutPass): boolean => user.id === id
    );
  }

  public deleteTask(event: Event, id: string): void {
    event.stopPropagation();

    this._store.dispatch(TasksActions.deleteTask({ taskId: id }));
  }

  public definePriorityClass(priority: TaskPrioritiesEnum): string {
    switch (priority) {
      case TaskPrioritiesEnum.Low: {
        return 'priority-low';
      }
      case TaskPrioritiesEnum.Medium: {
        return 'priority-medium';
      }
      case TaskPrioritiesEnum.High: {
        return 'priority-high';
      }
      default: {
        return '';
      }
    }
  }

  public openTaskInfo(task: ITask): void {
    this._dialog.open(TaskModalComponent, {
      data: { task: task, type: 'show' },
    });
  }

  private trackSortDirection(): void {
    this.subscribeTo = this.sortDirection$.subscribe(
      (direction: 'increase' | 'reduce'): void => {
        this.tasks$
          ?.pipe(
            take(1),
            map((tasks: ITask[] | null): ITask[] | null => {
              if (tasks) {
                const sortedTasks: ITask[] = this.sortTasks(tasks, direction!);
                this.dataSource = new MatTableDataSource(sortedTasks);
                this.dataSource.paginator = this.paginator;

                return sortedTasks;
              }

              return null;
            })
          )
          .subscribe();
      }
    );
  }

  private sortTasks(tasks: ITask[], direction: 'increase' | 'reduce'): ITask[] {
    return [...tasks].sort((a: ITask, b: ITask): number => {
      const dateA: number = new Date(a.date).getTime();
      const dateB: number = new Date(b.date).getTime();
      return direction === 'increase' ? dateA - dateB : dateB - dateA;
    });
  }

  private getTasks(): void {
    this.tasks$ = this._store.pipe(select(tasksSelector)).pipe(
      map((tasks: ITask[] | null): ITask[] | null => {
        if (!tasks) return null;

        const sortDirection: 'increase' | 'reduce' =
          this._sortDirectionService.getSortDirectionValue();
        const sortedTasks: ITask[] = this.sortTasks(tasks, sortDirection);

        this.dataSource = new MatTableDataSource(sortedTasks);
        this.dataSource.paginator = this.paginator;

        return tasks;
      })
    );
  }

  private getUsers(): void {
    this.subscribeTo = this._store
      .pipe(select(usersSelector))
      .subscribe((users: IUserWithoutPass[] | null): void => {
        this.users = users;
      });
  }

  private trackPageSize(): void {
    this.subscribeTo = fromEvent(window, 'resize')
      .pipe(
        startWith(0),
        map(() => window.innerHeight)
      )
      .subscribe((windowHeight: number): void => {
        this.windowHeight = windowHeight;
        this.updatePageSize();
      });
  }

  private updatePageSize(): void {
    if (this.paginator) {
      const pageSize: number = this.calculatePageSize();
      this.paginator.pageSize = pageSize;
      this.paginator._changePageSize(pageSize);
    }
  }

  private calculatePageSize(): number {
    return Math.floor((this.windowHeight - 320) / 74);
  }
}
