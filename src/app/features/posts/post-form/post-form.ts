import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PostService } from '../../../core/services/post.service';
import { UploadService } from '../../../core/services/upload.service';
import { API_HOST } from '../../../core/constants/api.constants';

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
  private uploadService = inject(UploadService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  authService = inject(AuthService);

  isEditMode = signal(false);
  loading = signal(false);
  loadingUsers = signal(false);
  submitted = signal(false);
  errorMessage = signal('');
  postId = signal<number | null>(null);

  selectedFile = signal<File | null>(null);
  imagePreview = signal<string>('');
  uploadingImage = signal(false);

  postForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    imageUrl: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode.set(true);
      this.postId.set(Number(id));
      this.loadPost(Number(id));
    }
  }

  loadPost(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.postService.getById(id).subscribe({
      next: (post) => {
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          imageUrl: post.imageUrl ?? '',
        });
        this.imagePreview.set(post.imageUrl ? `${API_HOST}${post.imageUrl}` : '');
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

    if (this.selectedFile()) {
      this.uploadingImage.set(true);

      this.uploadService.upload(this.selectedFile()!).subscribe({
        next: (uploadResult) => {
          this.uploadingImage.set(false);
          this.postForm.patchValue({ imageUrl: uploadResult.url });
          this.savePost();
        },
        error: () => {
          this.uploadingImage.set(false);
          this.errorMessage.set('Image upload failed.');
        },
      });

      return;
    }

    this.savePost();
  }

  private savePost(): void {
    const { title, content } = this.postForm.getRawValue();

    const payload = {
      title,
      content,
      userId: this.authService.currentUser()!.id,
    };

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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    this.selectedFile.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  get f() {
    return this.postForm.controls;
  }
}
