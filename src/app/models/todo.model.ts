export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: Date;
}