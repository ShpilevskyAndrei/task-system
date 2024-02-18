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

import { fromEvent, map, Observable, startWith } from 'rxjs';

import { ITask } from './interfaces/task.interface';
import { TasksService } from '../../../../core/services/requests/tasks.service';
import {AsyncPipe, DatePipe, NgIf, NgStyle} from '@angular/common';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { IUserWithoutPass } from '../../../../core/interfaces/user.interface';
import { UsersStateService } from '../../../../state/users-state.service';
import { TasksStateService } from '../../../../state/tasks-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaskModalComponent } from '../../../../shared/components/task-modal/task-modal.component';
import { IResponse } from '../../../../core/interfaces/response.interface';
import { TaskPrioritiesEnum } from './enums/task-priorities.enum';
import { UnsubscribeDirective } from '../../../../core/directives/unsubscribe.directive';
import { taskTableColumns } from './consts/task-table-columns';

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
  private readonly _taskService = inject(TasksService);
  private readonly _taskStateService = inject(TasksStateService);
  private readonly _usersStateService = inject(UsersStateService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialog = inject(MatDialog);

  public columns: string[] = taskTableColumns;
  public dataSource!: MatTableDataSource<ITask>;
  public tasks: ITask[] = [];
  public pageSize: number = this.calculatePageSize();

  public ngOnInit(): void {
    this.getTasks();
    this.trackPageSize();
  }

  public ngAfterViewInit(): void {
    if (this.paginator && this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  public getTasks(): void {
    this.subscribeTo = this._taskStateService
      .getTasks()
      .subscribe((tasks: ITask[] | null): void => {
        if (!tasks) return;

        this.tasks = tasks;
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.paginator = this.paginator;
      });
  }

  public getUserInfoById(id: string): Observable<IUserWithoutPass | null> {
    return this._usersStateService.getUserById(id);
  }

  public deleteTask(event: Event, id: string): void {
    event.stopPropagation();

    this._taskService.deleteTaskById(id).subscribe({
      next: (isDeleted: IResponse<boolean>): void => {
        if (!isDeleted) {
          this._snackBar.open(
            'Что-то пошло не так, попробуйте перезагрузить страницу',
            'ОК',
            {
              duration: 3000,
            }
          );

          return;
        }

        const updatedTaskList: ITask[] = this.tasks.filter(
          (item: ITask): boolean => item.id !== id
        );

        if (this.tasks.length - updatedTaskList.length !== 1) {
          this._snackBar.open(
            'Что-то пошло не так, попробуйте перезагрузить страницу',
            'ОК',
            {
              duration: 3000,
            }
          );

          return;
        }

        this._taskStateService.setAndSortTasks(updatedTaskList);
        this._snackBar.open(`Задача удалена успешно`, 'ОК', {
          duration: 3000,
        });
      },
    });
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
