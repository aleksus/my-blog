export interface Comment {
  id?: number;
  content: string;
  userId: number;
  authorName?: string;
  postId: number;
  postTitle?: string;
  createdAt?: string;
}
