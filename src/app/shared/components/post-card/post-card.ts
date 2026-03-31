import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Post } from '../../../core/models/post.model';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PreviewContentPipe } from '../../pipes/preview-pipe-pipe';


@Component({
  selector: 'app-post-card',
  imports: [RouterLink, DatePipe, PreviewContentPipe],
  templateUrl: './post-card.html',
  styleUrls: ['./post-card.css']
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() deletePost = new EventEmitter<number>();

  onDelete() {
    if (this.post.id) {
      this.deletePost.emit(this.post.id);
    }
  }
}