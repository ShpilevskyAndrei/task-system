import { Component, inject, Input } from '@angular/core';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { map, Observable, take } from 'rxjs';

import { UserStateService } from '../../../state/user-state.service';
import { IUserWithoutPass } from '../../../core/interfaces/user.interface';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { TasksStateService } from '../../../state/tasks-state.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButton, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() public activeTitle?: string;

  private readonly _tasksStateService = inject(TasksStateService);
  private readonly _userStateService = inject(UserStateService);
  private readonly _dialog = inject(MatDialog);

  public sortDirection$: Observable<'increase' | 'reduce'> =
    this._tasksStateService.getSortDirection();

  public userInfo$: Observable<IUserWithoutPass | null> =
    this._userStateService.getUserInfo();

  public createTask(): void {
    this._dialog.open(TaskModalComponent, {
      data: { type: 'create' },
    });
  }

  public toggleSortDirection(): void {
    this.sortDirection$.pipe(
      take(1),
      map((currentDirection): void => {
        const newSortDirection =
          currentDirection === 'increase' ? 'reduce' : 'increase';
        this._tasksStateService.setSortDirection(newSortDirection);
      })
    ).subscribe();
  }
}
