import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { AsyncPipe, NgIf } from '@angular/common';

import { Observable, of } from 'rxjs';

import { ProgressBarStateService } from './core/services/progress-bar-state.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressBar, AsyncPipe, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public loaderState$: Observable<boolean> = of(false);

  private readonly progressBarStateService = inject(ProgressBarStateService);

  public ngOnInit(): void {
    this.loaderState$ = this.progressBarStateService.getSpinnerState();
  }
}
