import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorsService } from '../api/services';
import { ToastrService } from 'ngx-toastr';
import { Author } from '../api/services/models/author';
import { FormsModule } from '@angular/forms';
import { Book } from '../api/services/models/book';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-books-form',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ book?.id ? 'Edit' : 'Create' }} Book</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form #form="ngForm" (ngSubmit)="save()">
        <div class="mb-3">
          <label class="form-label">Title</label>
          <input type="text" class="form-control" 
                 [(ngModel)]="formData.title" name="title" required
                 (ngModelChange)="onFieldChange('title', $event)">
        </div>
        <div class="mb-3">
          <label class="form-label">Author</label>
          <select class="form-select" 
                  [(ngModel)]="formData.author" 
                  name="author" 
                  required
                  (ngModelChange)="onFieldChange('author', $event)">
            <option [ngValue]="null">Select an author</option>
            <option *ngFor="let author of authors" [ngValue]="author.id">
              {{ author.name }}
            </option>
          </select>
        </div>
        <div class="mb-3">
          <label class="form-label">Published Date</label>
          <input type="date" class="form-control" 
                 [(ngModel)]="formData.published_date" name="published_date"
                 (ngModelChange)="onFieldChange('published_date', $event)">
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">Cancel</button>
      <button type="button" class="btn btn-primary" 
              [disabled]="!form.valid || !hasChanges" (click)="save()">
        Save
      </button>
    </div>
  `,
  standalone: true,
  imports:[
    FormsModule,
    CommonModule
  ]
})
export class BookFormComponent implements OnInit {
  @Input() book?: Book;
  authors: Author[] = [];
  formData: Partial<Book> = {};
  changedFields: Partial<Book> = {};
  hasChanges = false;
  loading = true;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loadAuthors();
    if (this.book) {
      this.formData = { ...this.book };
    }
  }

  loadAuthors() {
    this.loading = true;
    this.api.get('authors/').subscribe({
      next: (response: any) => {
        this.authors = response;
        this.loading = false;
      },
      error: () => {
        this.toastr.error('Failed to load authors');
        this.loading = false;
      }
    });
  }

  onFieldChange(field: keyof Book, value: any) {
    if (this.book) {
      // Only track changes if different from original
      if (value !== this.book[field]) {
        this.changedFields[field] = value;
      } else {
        delete this.changedFields[field];
      }
    } else {
      // For new books, track all non-empty values
      if (value !== null && value !== '') {
        this.changedFields[field] = value;
      } else {
        delete this.changedFields[field];
      }
    }
    
    this.hasChanges = Object.keys(this.changedFields).length > 0;
  }

  save() {
    if (!this.formData.title) {
      this.toastr.error('Title is required');
      return;
    }

    if (!this.formData.author) {
      this.toastr.error('Author is required');
      return;
    }

    this.activeModal.close({
      id: this.book?.id,
      changes: this.changedFields
    });
  }
}