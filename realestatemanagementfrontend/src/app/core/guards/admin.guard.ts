import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(): boolean {
    return this.check();
  }

  canActivateChild(): boolean {
    return this.check();
  }

  private check(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user || user.rol !== 'Admin') {
      this.router.navigate(['/core']);
      return false;
    }

    return true;
  }
}
