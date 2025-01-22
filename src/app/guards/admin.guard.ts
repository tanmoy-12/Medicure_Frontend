import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    const email = localStorage.getItem('email');
    const isAdmin = localStorage.getItem('isAdmin');
    if(isAdmin){
      return of(true); // Allow access if user type is admin
    }
    this.router.navigate(['/']);
    return of(false); // Allow access if user type is
  }
}
