import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../api/services';
import { catchError, map } from 'rxjs/operators';
import { Author } from '../api/services/models/author';
import { Book } from '../api/services/models/book';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthorFormComponent } from './author.form.component';
import { ApiService } from '../api.service';
import { error } from 'console';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  private authorsService = inject(AuthorsService);
  private modalService = inject(NgbModal);
  private toastr = inject(ToastrService);

  authors: Author[] = [];
  loading = true;

  ngOnInit() {
    this.loadAuthors();
  }

  constructor(private api: ApiService) {

  }
  loadAuthors() {
    this.loading = true;
    this.api.get('authors/').subscribe({
      next: (value: any) => {
        this.authors = value;
        this.loading = false;
      }
    })
  }

  openCreateModal() {
    const modalRef = this.modalService.open(AuthorFormComponent);
    modalRef.result.then(
      (result) => {
        this.api.post('authors/', result.changes,).subscribe({
          next: (value :any) => {
            this.authors.push(value);
          },
          error:(error:any)=>{
            console.warn(error)
          }
        })
      })
  }

  openEditModal(author: Author) {
    const modalRef = this.modalService.open(AuthorFormComponent);
    modalRef.componentInstance.author = author;

    modalRef.result.then(
      (result) => {
        this.api.update('authors', result.changes, author.id).subscribe({
          next: (value :any) => {
            const index = this.authors.findIndex(a => a.id === author.id);
            this.authors[index]=value;
          },
          error:(error:any)=>{
            console.warn(error)
          }
        })
      })
  }

  deleteAuthor(author: Author) {
    if (confirm(`Are you sure you want to delete ${author.name}?`)) {
      this.api.delete(`authors/${author.id}/`).subscribe({
        next: () => {
          this.authors = this.authors.filter(a => a.id !== author.id);
          this.toastr.success('Author deleted successfully');
        },
        error: () => {
          this.toastr.error('Failed to delete author');
        }
      });
    }
  }
}