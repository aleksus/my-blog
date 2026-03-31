import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Post } from '../../../core/models/post.model';
import { PostService } from '../../../core/services/post.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post-details',
  imports: [RouterLink, DatePipe],
  templateUrl: './post-details.html',
  styleUrls: ['./post-details.css'],
})
export class PostDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);

  post = signal<Post | null>(null);
  loading = false;
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadPost(id);
  }

  loadPost(id: number): void {
    this.loading = true;
    this.postService.getById(id).subscribe({
      next: (data) => {
        this.post.set(data);
        this.loading = false;
      },
      error: () => {
        this.error = 'Post not found.';
        this.loading = false;
      },
    });
  }

  onDelete(): void {
    const postId = this.post()?.id;
    if (!postId) return;

    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    this.postService.delete(postId).subscribe({
      next: () => {
        this.router.navigate(['/posts']);
      },
      error: () => {
        alert('Failed to delete post.');
      },
    });
  }
}
