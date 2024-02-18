import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';

import { Observable } from 'rxjs';

import { ITask } from '../../../features/dashboard/pages/tasks/interfaces/task.interface';
import { TaskPrioritiesEnum } from '../../../features/dashboard/pages/tasks/enums/task-priorities.enum';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { IUserWithoutPass } from '../../../core/interfaces/user.interface';
import { UsersStateService } from '../../../state/users-state.service';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { EnumToArrayPipe } from '../../pipes/enum-to-array.pipe';
import { TasksService } from '../../../core/services/requests/tasks.service';
import { TasksStateService } from '../../../state/tasks-state.service';
import { IResponse } from '../../../core/interfaces/response.interface';
import { UnsubscribeDirective } from '../../../core/directives/unsubscribe.directive';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatSelect,
    MatOption,
    AsyncPipe,
    MatRadioGroup,
    MatRadioButton,
    EnumToArrayPipe,
    NgForOf,
    DateFormatPipe,
    NgIf,
  ],
  providers: [DateFormatPipe],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent extends UnsubscribeDirective implements OnInit {
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _usersStateService = inject(UsersStateService);
  private readonly _dialogRef = inject(MatDialogRef<TaskModalComponent>);
  private readonly _dateFormatPipe = inject(DateFormatPipe);
  private readonly _tasksService = inject(TasksService);
  private readonly _tasksStateService = inject(TasksStateService);

  private readonly _date: Date = new Date();

  protected readonly TaskPrioritiesEnum = TaskPrioritiesEnum;

  public taskForm!: FormGroup;
  public isBtnDisabled = false;
  public users$: Observable<IUserWithoutPass[] | null> =
    this._usersStateService.getUsersInfo();

  public constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { task?: ITask; type: 'show' | 'create' }
  ) {
    super();
  }

  public ngOnInit(): void {
    this.initTaskForm();
    this.patchTaskValue();
  }

  public createTask(): void {
    if (this.taskForm.invalid) return;

    this.isBtnDisabled = true;

    const task = this.taskForm.getRawValue();
    task.date = new Date().toString();

    this.subscribeTo = this._tasksService.createTask(task).subscribe({
      next: (response: IResponse<ITask>): void => {
        if (!response.data) {
          this._snackBar.open('', 'OK', {
            duration: 3000,
          });

          return;
        }

        this._tasksStateService.addTask(response.data);
      },
      complete: (): void => {
        this.isBtnDisabled = false;
        this.closeModal();
      },
    });
  }

  public saveTaskAsADraft(): void {
    this._snackBar.open(
      'Данный функционал находиться в процессе разработки',
      'ОК',
      {
        duration: 3000,
      }
    );
  }

  public closeModal(): void {
    this._dialogRef.close();
  }

  public getPriorityClass(priority: string): string {
    switch (priority) {
      case TaskPrioritiesEnum.Low: {
        return 'mat-radio-button-low';
      }
      case TaskPrioritiesEnum.Medium: {
        return 'mat-radio-button-medium';
      }
      case TaskPrioritiesEnum.High: {
        return 'mat-radio-button-high';
      }
      default: {
        return '';
      }
    }
  }

  private initTaskForm(): void {
    this.taskForm = new FormGroup({
      date: new FormControl(''),
      title: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      priority: new FormControl(TaskPrioritiesEnum.Medium, [
        Validators.required,
      ]),
      userId: new FormControl('', [Validators.required]),
    });

    if (this.data.type === 'create')
      this.patchReformattedDate(this._date.toString());

    this.taskForm.controls['date'].disable()
  }

  private patchTaskValue(): void {
    if (this.data.type === 'create' || !this.data.task) return;

    this.taskForm.patchValue(this.data.task);
    this.patchReformattedDate(this.data.task.date.toString());

    this.taskForm.controls['title'].disable()
    this.taskForm.controls['description'].disable()
    this.taskForm.controls['priority'].disable()
    this.taskForm.controls['userId'].disable()
  }

  private patchReformattedDate(date: string): void {
    this.taskForm.controls['date'].patchValue(
      this._dateFormatPipe.transform(date.toString())
    );
  }
}
