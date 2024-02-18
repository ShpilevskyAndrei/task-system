import { Component, inject, Input } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { UserStateService } from '../../../state/user-state.service';
import { IUserWithoutPass } from '../../../core/interfaces/user.interface';
import { TaskModalComponent } from '../task-modal/task-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, NgIf, MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() public activeTitle?: string;

  private readonly _userStateService = inject(UserStateService);
  private readonly _dialog = inject(MatDialog);

  public userInfo$: Observable<IUserWithoutPass | null> =
    this._userStateService.getUserInfo();

  public createTask(): void {
    const dialogRef = this._dialog.open(TaskModalComponent, {
      data: { type: 'create' },
    });

    dialogRef.afterClosed().subscribe((result): void => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
