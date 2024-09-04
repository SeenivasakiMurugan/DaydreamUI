import { Component, OnInit , Inject} from '@angular/core';
import { AboutComponent } from '../../static-pages/about/about.component';
import { RouterLink , RouterOutlet , Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { AuthService } from '../../Service/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AboutComponent , RouterLink , RouterOutlet , CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  isLoggedIn : boolean = false;
  username : string | null = null;

  constructor
  (
    private router : Router
    , private _authService : AuthService
    , @Inject(DOCUMENT) private document: Document
  ){}

  ngOnInit() {
    this.username = sessionStorage.getItem("username") ?? '';
    this.isLoggedIn = this._authService.checkLogin();
  }

  logout(){
    //this._authService.logout();
    sessionStorage.clear();
    sessionStorage.removeItem("username");
  }

  getInitials(): string {
    if (this.username) {
      const names = this.username.split(' ');
      const initials = names[0].charAt(0).toUpperCase() + (names[1] ? names[1].charAt(0).toUpperCase() : '');
      return initials;
    }
    return '';
  }
}
