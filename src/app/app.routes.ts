import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './static-pages/about/about.component';
import { NgModule } from '@angular/core';
import { StoryuploadComponent } from './admin-pages/storyupload/storyupload.component';
import { StoryListComponent } from './admin-pages/storylist/storylist.component';
import { StoryComponent } from './user-pages/story/story.component';
import { LoginComponent } from './user-pages/login/login.component';
import { SignupComponent } from './user-pages/signup/signup.component';
import { AuthGuard } from './auth.guard';
 
export const routes: Routes = [
    { path:'about', component:AboutComponent },
    { path: '', redirectTo: '/storylist', pathMatch: 'full' },
    { path:'storylist', component:StoryListComponent },
    { path:'login' , component:LoginComponent },
    { path:'signup', component:SignupComponent },
    // { path: '**', redirectTo: '/login' },
    { path:'storyupload', component:StoryuploadComponent },
    { path:'storyupload/:id', component: StoryuploadComponent},
    { path:'story/:id', component:StoryComponent},
    // { path:'storyupload', component:StoryuploadComponent , canActivate:[AuthGuard] },
    // { path:'storyupload/:id', component: StoryuploadComponent , canActivate:[AuthGuard] },
    // { path:'story/:id', component:StoryComponent , canActivate:[AuthGuard] }
];


@NgModule({
    imports:[RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRouteModule{
    
}