import { Component, Input, OnChanges, SimpleChanges, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Comment } from '../../core/models/comment.model';
import { User } from '../..//core/models/user.model';
import { CommentService } from '../..//core/services/comment.service';
import { UserService } from '../..//core/services/user.service';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-section.html',
  styleUrl: './comment-section.css'
})
export class CommentSectionComponent implements OnChanges {
  @Input({ required: true }) postId!: number;

  private commentService = inject(CommentService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  comments = signal<Comment[]>([]);
  users = signal<User[]>([]);
  loading = signal(false);
  loadingUsers = signal(false);
  submitting = signal(false);
  submitted = signal(false);
  errorMessage = signal('');

  commentForm = this.fb.nonNullable.group({
    content: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
    userId: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['postId']?.currentValue) {
      this.loadUsers();
      this.loadComments();
    }
  }

  loadComments(): void {
    if (!this.postId) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.commentService.getByPostId(this.postId).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load comments.');
        this.loading.set(false);
      }
    });
  }

  loadUsers(): void {
    this.loadingUsers.set(true);

    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loadingUsers.set(false);
      },
      error: () => {
        this.loadingUsers.set(false);
      }
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.commentForm.invalid || !this.postId) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    const payload = {
      ...this.commentForm.getRawValue(),
      postId: this.postId
    };

    this.commentService.create(payload).subscribe({
      next: (createdComment) => {
        this.comments.update(current => [createdComment, ...current]);
        this.commentForm.reset({
          content: '',
          userId: 0
        });
        this.submitted.set(false);
        this.submitting.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to add comment.');
        this.submitting.set(false);
      }
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('Delete this comment?');
    if (!confirmed) return;

    this.commentService.delete(id).subscribe({
      next: () => {
        this.comments.update(current => current.filter(comment => comment.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete comment.');
      }
    });
  }

  get f() {
    return this.commentForm.controls;
  }
}