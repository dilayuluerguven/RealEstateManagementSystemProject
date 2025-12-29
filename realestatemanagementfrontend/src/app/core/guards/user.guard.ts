import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserGuard implements CanActivate, CanActivateChild {

  constructor(private router: Router) {}

  canActivate(): boolean {
    return this.check();
  }

  canActivateChild(): boolean {
    return this.check();
  }

  private check(): boolean {
    const role = localStorage.getItem('role');

    if (role !== 'User') {
      this.router.navigate(['/core/admin']);
      return false;
    }

    return true;
  }
}
