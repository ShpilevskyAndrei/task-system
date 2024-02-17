import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { ITask } from '../../../../../../core/interfaces/task.interface';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [],
  templateUrl: './task-modal.component.html',
  styleUrl: './task-modal.component.scss',
})
export class TaskModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { task?: ITask; type: 'show' | 'create' }
  ) {}
}
