import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';


@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css'
})
export class PostFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  users: User[] = [];

  isEditMode = false;
  postId?: number;
  loading = false;
  submitted = false;
  errorMessage = '';

  postForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    userId: [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit(): void {
    this.loadUsers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.postId = Number(id);
      this.loadPost(this.postId);
    }
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load authors.';
      }
    });
  }

  loadPost(id: number): void {
    this.loading = true;
    this.postService.getById(id).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          userId: post.userId
        });
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load post.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const payload = this.postForm.getRawValue();

    if (this.isEditMode && this.postId) {
      this.postService.update(this.postId, payload).subscribe({
        next: () => {
          this.router.navigate(['/posts', this.postId]);
        },
        error: () => {
          this.errorMessage = 'Failed to update post.';
        }
      });
    } else {
      this.postService.create(payload).subscribe({
        next: () => {
          this.router.navigate(['/posts']);
        },
        error: () => {
          this.errorMessage = 'Failed to create post.';
        }
      });
    }
  }

  get f() {
    return this.postForm.controls;
  }
}