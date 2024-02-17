import { Component, inject, OnInit } from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Event as NavigationEvent,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

import { filter } from 'rxjs';

import { SideMenuComponent } from '../../shared/components/side-menu/side-menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { UserStateService } from '../../state/user-state.service';
import { UnsubscribeDirective } from '../../core/directives/unsubscribe.directive';
import { UserService } from '../../core/services/requests/user.service';
import { IUserWithoutPass } from '../../core/interfaces/user.interface';
import { IResponse } from '../../core/interfaces/response.interface';
import {
  INav,
  sideMenuNavs,
} from '../../shared/components/side-menu/side-menu-navs';
import { UsersStateService } from '../../state/users-state.service';
import { TasksService } from '../../core/services/requests/tasks.service';
import { TasksStateService } from '../../state/tasks-state.service';
import { ITask } from '../../core/interfaces/task.interface';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    MatDrawer,
    MatDrawerContainer,
    MatDrawerContent,
    SideMenuComponent,
    RouterOutlet,
    HeaderComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent extends UnsubscribeDirective implements OnInit {
  private readonly _userStateService = inject(UserStateService);
  private readonly _userService = inject(UserService);
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _router = inject(Router);
  private readonly _usersStateService = inject(UsersStateService);
  private readonly _tasksStateService = inject(TasksStateService);
  private readonly _tasksService = inject(TasksService);

  public activeNav?: INav;

  public ngOnInit(): void {
    this.getUserInfo();
    this.getUsersInfo();
    this.getTasks();
    this.trackPaths();
  }

  private getTasks(): void {
    this.subscribeTo = this._tasksService
      .getTaskList()
      .subscribe((tasks: ITask[] | null): void => {
        if (!tasks || !tasks.length) return;

        this._tasksStateService.setTasks(tasks);
      });
  }

  private getUsersInfo(): void {
    this.subscribeTo = this._userService
      .getUserList()
      .subscribe((response: IResponse<IUserWithoutPass[]>): void => {
        if (
          !response.data ||
          (response.status === 'error' && response.errorMessage)
        ) {
          this._snackBar.open(response.errorMessage!, 'ОК', {
            duration: 3000,
          });

          return;
        }

        this._usersStateService.setUsersInfo(response.data);
      });
  }

  private getUserInfo(): void {
    this.subscribeTo = this._userService.getUserInfo().subscribe({
      next: (response: IResponse<IUserWithoutPass>): void => {
        if (
          !response.data ||
          (response.status === 'error' && response.errorMessage)
        ) {
          this._snackBar.open(response.errorMessage!, 'ОК', {
            duration: 3000,
          });

          return;
        }

        this._userStateService.setUserInfo(response.data);
      },
    });
  }

  private trackPaths(): void {
    this.activeNav = sideMenuNavs.find(
      (nav: INav): boolean =>
        nav.path === this.extractPageFromUrl(this._router.url)
    );

    this.subscribeTo = this._router.events
      .pipe(filter((event): boolean => event instanceof NavigationEnd))
      .subscribe((event: NavigationEvent): void => {
        if (event instanceof NavigationEnd) {
          this.activeNav = sideMenuNavs.find(
            (e: INav): boolean =>
              e.path === this.extractPageFromUrl(this._router.url)
          );
        }
      });
  }

  private extractPageFromUrl(url: string): string {
    const parts: string[] = url.split('/');

    return parts[parts.length - 1];
  }
}
