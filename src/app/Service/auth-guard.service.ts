import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate , ActivatedRouteSnapshot, RouterStateSnapshot , Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.checkLogin()) {
      return true;
    } else {
      this.authService.setRedirectUrl(state.url, route.queryParams); 
      this.router.navigate(['/login']);
      return false;
    }
  }
}
