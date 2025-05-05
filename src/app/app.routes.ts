import { Routes } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { AuthorsComponent } from './authors/authors.component';

export const routes: Routes = [
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: 'books', component: BooksComponent },
  { path: 'authors', component: AuthorsComponent }
];
