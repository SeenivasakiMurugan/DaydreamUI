import { Component, OnInit } from '@angular/core';
import { RouterOutlet , Router , NavigationEnd } from '@angular/router';
import { LayoutComponent } from './shared-component/layout/layout.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: 
  [
    RouterOutlet 
    , LayoutComponent 
    , HttpClientModule 
    , CommonModule
    , DialogModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  isLoginPage:boolean = false;
  constructor
  (
    private router : Router
  ){}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isLoginPage = this.isLoginRoute();
    });
  }
  
  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
