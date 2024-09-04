import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import '../node_modules/bootstrap';
import '../node_modules/@popperjs/core';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
