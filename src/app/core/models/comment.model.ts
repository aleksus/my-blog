export interface Comment {
  id?: number;
  text: string;
  userId: number;
  authorName?: string;
  postId: number;
  postTitle?: string;
  createdAt?: string;
}