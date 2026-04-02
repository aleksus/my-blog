import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { PostService } from '../../../core/services/post.service';
import { Post } from '../../../core/models/post.model';
import { CommentSectionComponent } from '../../comment-section/comment-section';


@Component({
  selector: 'app-post-details',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentSectionComponent],
  templateUrl: './post-details.html',
  styleUrl: './post-details.css'
})
export class PostDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private postService = inject(PostService);

  post = signal<Post | null>(null);
  loading = signal(false);
  errorMessage = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.errorMessage.set('Invalid post ID.');
      return;
    }

    this.loadPost(id);
  }

  loadPost(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.postService.getById(id).subscribe({
      next: (data) => {
        this.post.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Post not found.');
        this.loading.set(false);
      }
    });
  }

  onDelete(): void {
    const currentPost = this.post();
    if (!currentPost) return;

    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    this.postService.delete(currentPost.id!).subscribe({
      next: () => {
        this.router.navigate(['/posts']);
      },
      error: () => {
        this.errorMessage.set('Failed to delete post.');
      }
    });
  }
}