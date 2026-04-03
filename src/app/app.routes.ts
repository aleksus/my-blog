import { Routes } from '@angular/router';
import { PostListComponent } from './features/posts/post-list/post-list';
import { HomeComponent } from './features/home/home';
import { NotFoundComponent } from './features/not-found/not-found';
import { PostDetailsComponent } from './features/posts/post-details/post-details';
import { PostFormComponent } from './features/posts/post-form/post-form';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/new', component: PostFormComponent, canActivate: [authGuard] },
  { path: 'posts/edit/:id', component: PostFormComponent, canActivate: [authGuard] },
  { path: 'posts/:id', component: PostDetailsComponent },
  { path: '**', component: NotFoundComponent },
];
