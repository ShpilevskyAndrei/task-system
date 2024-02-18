import { Component, inject, OnInit } from '@angular/core';
import {
  MatFormField,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { first } from 'rxjs';

import { AuthService } from '../../core/services/requests/auth.service';
import { ITokens } from '../../core/interfaces/tokens.interface';
import { UnsubscribeDirective } from '../../core/directives/unsubscribe.directive';
import { IResponse } from '../../core/interfaces/response.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatButton,
    MatIcon,
    MatSuffix,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends UnsubscribeDirective implements OnInit {
  public isPassVisible = false;
  public isBtnDisabled = false;
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _snackBar = inject(MatSnackBar);

  public changePassVisibility(): void {
    this.isPassVisible = !this.isPassVisible;
  }

  public ngOnInit(): void {
    this.checkIsAuthorized();
  }

  private checkIsAuthorized(): void {
    this._authService
      .getIsAuthorized()
      .pipe(first())
      .subscribe((isAuth: boolean): void => {
        if (isAuth) {
          this._snackBar.open('Вы уже авторизованный пользователь', 'ОК', {
            duration: 3000,
          });

          void this._router.navigate(['/dashboard']);
        }
      });
  }

  public login(): void {
    if (this.loginForm.invalid) return;

    this.isBtnDisabled = true;

    this.subscribeTo = this._authService
      .login(this.loginForm.getRawValue())
      .subscribe({
        next: (response: IResponse<ITokens>): void => {
          if (response.status === 'error' && response.errorMessage) {
            this._snackBar.open(response.errorMessage, 'ОК', {
              duration: 3000,
            });

            return;
          }

          this._router.navigate(['/dashboard']).then(() => {
            this._snackBar.open('Вы успешно авторизовались', 'ОК', {
              duration: 3000,
            });
          });
        },
        complete: (): void => {
          this.isBtnDisabled = false;
        },
      });
  }
}
