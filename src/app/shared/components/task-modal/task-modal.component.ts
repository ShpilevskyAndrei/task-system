import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

import { ITask } from '../../../features/dashboard/pages/tasks/interfaces/task.interface';
import { TaskPrioritiesEnum } from '../../../features/dashboard/pages/tasks/enums/task-priorities.enum';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [FormsModule, MatFormField, MatInput, MatLabel, ReactiveFormsModule],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent implements OnInit {
  public taskForm!: FormGroup;

  public constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { task?: ITask; type: 'show' | 'create' }
  ) {}

  public ngOnInit(): void {
    this.initTaskForm();
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
  }
}
