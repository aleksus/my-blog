import { Routes } from '@angular/router';
import { PostListComponent } from './features/posts/post-list/post-list';
import { HomeComponent } from './features/home/home';
import { NotFoundComponent } from './features/not-found/not-found';
import { PostDetailsComponent } from './features/posts/post-details/post-details';
import { PostFormComponent } from './features/posts/post-form/post-form';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  { path: 'home', component: HomeComponent },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/new', component: PostFormComponent },
  { path: 'posts/edit/:id', component: PostFormComponent },
  { path: 'posts/:id', component: PostDetailsComponent },
  { path: '**', component: NotFoundComponent },
];
