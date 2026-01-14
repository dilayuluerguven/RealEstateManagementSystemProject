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
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user || user.rol !== 'User') {
      this.router.navigate(['/core/admin']);
      return false;
    }

    return true;
  }
}
