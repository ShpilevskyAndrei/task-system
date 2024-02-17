import { Component, inject, Input } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import { INav, sideMenuNavs } from './side-menu-navs';
import { UnsubscribeDirective } from '../../../core/directives/unsubscribe.directive';
import { NavItemComponent } from '../nav-item/nav-item.component';
import { AuthService } from '../../../core/services/requests/auth.service';
import { IResponse } from '../../../core/interfaces/response.interface';

@Component({
  selector: 'app-side-menu',
  standalone: true,
  imports: [MatDrawer, RouterLink, NgForOf, NgIf, NgClass, NavItemComponent],
  templateUrl: './side-menu.component.html',
  styleUrl: './side-menu.component.scss',
})
export class SideMenuComponent extends UnsubscribeDirective {
  @Input() public activePath? = '';

  protected readonly sideMenuNavs: INav[] = sideMenuNavs;

  private readonly _router = inject(Router);
  private readonly _authService = inject(AuthService);
  private readonly _snackBar = inject(MatSnackBar);

  public logout(): void {
    this.subscribeTo = this._authService.logout().subscribe({
      next: (response: IResponse<boolean>): void => {
        if (!response.data && response.errorMessage) {
          this._snackBar.open(response.errorMessage, 'ОК', {
            duration: 3000,
          });
        }

        this._router.navigate(['/']).then((): void => {
          this._snackBar.open('Вы успешно вышли из системы', 'ОК', {
            duration: 3000,
          });
        });
      },
    });
  }
}
