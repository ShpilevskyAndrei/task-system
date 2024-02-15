import { Directive, OnDestroy } from "@angular/core";

import { Subscription } from "rxjs";

@Directive()
export abstract class UnsubscribeDirective implements OnDestroy {
  private subscription: Subscription[] = [];

  public set subscribeTo(sub: Subscription) {
    this.subscription.push(sub);
  }

  public unsubscribeFromAll(): void {
    this.subscription.forEach((sub: Subscription) => sub.unsubscribe());
  }

  public ngOnDestroy(): void {
    this.unsubscribeFromAll();
  }
}
