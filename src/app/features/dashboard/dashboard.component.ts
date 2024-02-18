import { Component, inject, OnInit } from '@angular/core';
import {
  MatDrawer,
  MatDrawerContainer,
  MatDrawerContent,
} from '@angular/material/sidenav';
import {
  Event as NavigationEvent,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

import { filter } from 'rxjs';
import { Store } from '@ngrx/store';

import { SideMenuComponent } from '../../shared/components/side-menu/side-menu.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { UnsubscribeDirective } from '../../core/directives/unsubscribe.directive';
import {
  INav,
  sideMenuNavs,
} from '../../shared/components/side-menu/side-menu-navs';
import * as UserActions from '../../state/user/actions';
import * as UsersActions from '../../state/users/actions';
import * as TasksActions from '../../state/tasks/actions';

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
  private readonly _router = inject(Router);
  private readonly _store = inject(Store);

  public activeNav?: INav;

  public ngOnInit(): void {
    this._store.dispatch(UserActions.getUser());
    this._store.dispatch(UsersActions.getUsers());
    this._store.dispatch(TasksActions.getTasks());
    this.trackPaths();
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
