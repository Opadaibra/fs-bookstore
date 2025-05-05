import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthorsService } from '../api/services';
import { ToastrService } from 'ngx-toastr';
import { Author } from '../api/services/models/author';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-form',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ author?.id ? 'Edit' : 'Create' }} Author</h4>
      <button type="button" class="btn-close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <form #form="ngForm" (ngSubmit)="save()">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" 
                 [(ngModel)]="formData.name" name="name" required
                 (ngModelChange)="onFieldChange('name', $event)">
        </div>
        <div class="mb-3">
          <label class="form-label">Bio</label>
          <textarea class="form-control" 
                    [(ngModel)]="formData.bio" name="bio"
                    (ngModelChange)="onFieldChange('bio', $event)"></textarea>
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
    FormsModule
  ]
})
export class AuthorFormComponent {
  @Input() author?: Author;
  formData: Partial<Author> = {};
  changedFields: Partial<Author> = {};
  hasChanges = false;

  constructor(
    public activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    if (this.author) {
      this.formData = { ...this.author };
    }
  }

  onFieldChange(field: keyof Author, value: any) {
    if (this.author) {
      // Only track changes if different from original
      if (value !== this.author[field]) {
        this.changedFields[field] = value;
      } else {
        delete this.changedFields[field];
      }
    } else {
      // For new authors, track all non-empty values
      if (value) {
        this.changedFields[field] = value;
      } else {
        delete this.changedFields[field];
      }
    }
    
    this.hasChanges = Object.keys(this.changedFields).length > 0;
  }

  save() {
    if (!this.formData.name) {
      this.toastr.error('Name is required');
      return;
    }

    this.activeModal.close({
      id: this.author?.id,
      changes: this.changedFields
    });
  }
}