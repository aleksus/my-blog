import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Post } from '../../../core/models/post.model';
import { User } from '../../../core/models/user.model';
import { PostService } from '../../../core/services/post.service';
import { UserService } from '../../../core/services/user.service';
import { PostCardComponent } from '../../../shared/components/post-card/post-card';

@Component({
  selector: 'app-post-list',
  imports: [FormsModule, PostCardComponent],
  templateUrl: './post-list.html',
  styleUrls: ['./post-list.css'],
})
export class PostListComponent implements OnInit {
  private postService = inject(PostService);
  private userService = inject(UserService);

  posts = signal<Post[]>([]);
  filteredPosts = signal<Post[]>([]);
  users = signal<User[]>([]);

  searchTerm = '';
  selectedUserId = '';

  loading = false;
  error = '';

  ngOnInit(): void {
    this.loadPosts();
    this.loadUsers();
  }

  loadPosts(): void {
    this.loading = true;
    this.postService.getAll().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.filteredPosts.set(data);
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load posts.';
        this.loading = false;
      },
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users.set(data);
      },
    });
  }

  applyFilters(): void {
    this.filteredPosts.set(
      this.posts().filter((post) => {
        const matchesSearch = post.title.toLowerCase().includes(this.searchTerm.toLowerCase());

        const matchesUser = !this.selectedUserId || post.userId === Number(this.selectedUserId);

        return matchesSearch && matchesUser;
      }),
    );
  }

  onDelete(postId: number): void {
    const confirmed = confirm('Are you sure you want to delete this post?');
    if (!confirmed) return;

    this.postService.delete(postId).subscribe({
      next: () => {
        this.loadPosts();
      },
      error: () => {
        alert('Failed to delete post.');
      },
    });
  }
}
