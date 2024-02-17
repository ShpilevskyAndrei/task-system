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

import { Observable } from 'rxjs';

import { ITask } from '../../../../core/interfaces/task.interface';
import { TasksService } from '../../../../core/services/requests/tasks.service';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { IUserWithoutPass } from '../../../../core/interfaces/user.interface';
import { UsersStateService } from '../../../../state/users-state.service';
import { TasksStateService } from '../../../../state/tasks-state.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TaskModalComponent } from './modals/task-modal/task-modal.component';

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
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'date',
    'priority',
    'assigner',
    'name',
    'delete',
  ];
  public dataSource!: MatTableDataSource<ITask>;
  public tasks: ITask[] = [];

  private readonly _taskService = inject(TasksService);
  private readonly _taskStateService = inject(TasksStateService);
  private readonly _usersStateService = inject(UsersStateService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _dialog = inject(MatDialog);

  @ViewChild(MatPaginator) public paginator: MatPaginator | null = null;

  public ngOnInit(): void {
    this.getTasks();
  }

  public ngAfterViewInit() {
    if (this.paginator && this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
  }

  public getTasks(): void {
    this._taskStateService
      .getTasks()
      .subscribe((tasks: ITask[] | null): void => {
        if (!tasks) return;
        this.tasks = tasks;
        this.dataSource = new MatTableDataSource(tasks);
        this.dataSource.paginator = this.paginator;
      });
  }

  public getUserInfoById(id: string): Observable<IUserWithoutPass | undefined> {
    return this._usersStateService.getUserById(id);
  }

  public deleteTask(event: Event, id: string): void {
    event.stopPropagation();

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

    this._taskStateService.setTasks(updatedTaskList);
    this._snackBar.open(`Задача удалена успешно`, 'ОК', {
      duration: 3000,
    });
  }

  public definePriorityClass(priority: string): string {
    switch (priority) {
      case 'Низкий': {
        return 'priority-low';
      }
      case 'Средний': {
        return 'priority-medium';
      }
      case 'Высокий': {
        return 'priority-high';
      }
      default: {
        return '';
      }
    }
  }

  public openTaskInfo(task: ITask): void {
    const dialogRef = this._dialog.open(TaskModalComponent, {
      data: { task: task, type: 'show' },
    });

    dialogRef.afterClosed().subscribe((result): void => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
