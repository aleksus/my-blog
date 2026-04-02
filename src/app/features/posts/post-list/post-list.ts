import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';
import { PreviewContentPipe } from '../../../shared/pipes/preview-pipe-pipe';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [RouterLink, PreviewContentPipe],
  templateUrl: './post-list.html',
  styleUrl: './post-list.css',
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);

  posts = signal<Post[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.postService.getAll().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load posts.');
        this.loading.set(false);
      },
    });
  }

  onDelete(id: number): void {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    this.postService.delete(id).subscribe({
      next: () => {
        this.posts.update((posts) => posts.filter((post) => post.id !== id));
      },
      error: () => {
        this.errorMessage.set('Failed to delete post.');
      },
    });
  }
}
