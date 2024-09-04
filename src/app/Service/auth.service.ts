import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn: boolean = false;  
  private redirectUrl: string = '';     
  private redirectParams: any = null;   

  constructor(private router: Router) {}
  
  checkLogin(): boolean {
    return !!sessionStorage.getItem('username');
  }
  
  login(): void {
    this.isLoggedIn = !!sessionStorage.getItem('username');

    if (this.redirectUrl) {
      this.router.navigate([this.redirectUrl], { queryParams: this.redirectParams });
      this.redirectUrl = '';
      this.redirectParams = null;
    } else {
      this.router.navigate(['/']);
    }
  }

  logout(): void {
    sessionStorage.clear();
    sessionStorage.removeItem("username");
  }

  setRedirectUrl(url: string, params: any = null): void {
    this.redirectUrl = url;
    this.redirectParams = params;
  }
}
