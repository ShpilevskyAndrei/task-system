import { Component, inject, Input } from '@angular/core';
import { AsyncPipe, NgIf, NgStyle } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { map, Observable, take } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { IUserWithoutPass } from '../../../core/interfaces/user.interface';
import { TaskModalComponent } from '../task-modal/task-modal.component';
import { SortDirectionService } from '../../../state/mock/sort-direction.service';
import { userSelector } from '../../../state/user/selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButton, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() public activeTitle?: string;

  private readonly _tasksStateService = inject(SortDirectionService);
  private readonly _dialog = inject(MatDialog);
  private readonly _store = inject(Store);

  public sortDirection$: Observable<'increase' | 'reduce'> =
    this._tasksStateService.getSortDirection();

  public userInfo$: Observable<IUserWithoutPass | null> = this._store.pipe(
    select(userSelector)
  );

  public createTask(): void {
    this._dialog.open(TaskModalComponent, {
      data: { type: 'create' },
    });
  }

  public toggleSortDirection(): void {
    this.sortDirection$
      .pipe(
        take(1),
        map((currentDirection: 'increase' | 'reduce'): void => {
          const newSortDirection: 'increase' | 'reduce' =
            currentDirection === 'increase' ? 'reduce' : 'increase';
          this._tasksStateService.setSortDirection(newSortDirection);
        })
      )
      .subscribe();
  }
}
