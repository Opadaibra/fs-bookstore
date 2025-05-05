import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsService } from '../api/services';
import { Author } from '../api/services/models/author';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../api.service';
import { BookFormComponent } from './book.form.componente';
import { Book } from '../api/services/models/book';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  private authorsService = inject(AuthorsService);
  private modalService = inject(NgbModal);
  private toastr = inject(ToastrService);

  books: Book[] = [];
  loading = true;

  ngOnInit() {
    this.loadAuthors();
  }

  constructor(private api: ApiService) {

  }
  loadAuthors() {
    this.loading = true;
    this.api.get('books/').subscribe({
      next: (value: any) => {
        this.books = value;
        this.loading = false;
      }
    })
  }

  openCreateModal() {
    const modalRef = this.modalService.open(BookFormComponent);
    modalRef.result.then(
      (result) => {
        this.api.post('books/', result.changes,).subscribe({
          next: (value :any) => {
            this.books.push(value);
          },
          error:(error:any)=>{
            console.warn(error)
          }
        })
      })
  }

  openEditModal(book: Book) {
    const modalRef = this.modalService.open(BookFormComponent);
    modalRef.componentInstance.book = book;

    modalRef.result.then(
      (result) => {
        this.api.update('books', result.changes, book.id).subscribe({
          next: (value :any) => {
            const index = this.books.findIndex(a => a.id === book.id);
            this.books[index]=value;
          },
          error:(error:any)=>{
            console.warn(error)
          }
        })
      })
  }

  deleteAuthor(author: Book) {
    if (confirm(`Are you sure you want to delete ${author.title}?`)) {
      this.api.delete(`books/${author.id}/`).subscribe({
        next: () => {
          this.books = this.books.filter(a => a.id !== author.id);
          this.toastr.success('Author deleted successfully');
        },
        error: () => {
          this.toastr.error('Failed to delete author');
        }
      });
    }
  }
}