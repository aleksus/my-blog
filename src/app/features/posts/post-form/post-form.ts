import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { User } from '../../../core/models/user.model';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = signal(false);
  loading = signal(false);
  loadingUsers = signal(false);
  submitted = signal(false);
  errorMessage = signal('');
  postId = signal<number | null>(null);
  users = signal<User[]>([]);

  postForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    userId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit(): void {
    this.loadUsers();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.postId.set(Number(id));
      this.loadPost(Number(id));
    }
  }

  loadUsers(): void {
    this.loadingUsers.set(true);

    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loadingUsers.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load authors.');
        this.loadingUsers.set(false);
      },
    });
  }

  loadPost(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.postService.getById(id).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          userId: post.userId,
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load post.');
        this.loading.set(false);
      },
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    this.errorMessage.set('');

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const payload = this.postForm.getRawValue();

    if (this.isEditMode() && this.postId()) {
      this.postService.update(this.postId()!, payload).subscribe({
        next: () => this.router.navigate(['/posts']),
        error: () => this.errorMessage.set('Failed to update post.'),
      });
    } else {
      this.postService.create(payload).subscribe({
        next: () => this.router.navigate(['/posts']),
        error: () => this.errorMessage.set('Failed to create post.'),
      });
    }
  }

  get f() {
    return this.postForm.controls;
  }
}
