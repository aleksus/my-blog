export interface Post {
  id?: number;
  title: string;
  content: string;
  userId: number;
  authorName?: string;
  imageUrl?: string;
  createdAt?: string;
}
