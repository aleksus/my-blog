import { Routes } from '@angular/router';
import { PostListComponent } from './features/posts/post-list/post-list';
import { HomeComponent } from './features/home/home';
import { NotFoundComponent } from './features/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'posts', component: PostListComponent },

  { path: '**', component: NotFoundComponent },
];
