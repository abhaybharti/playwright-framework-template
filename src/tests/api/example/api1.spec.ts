import { test, expect } from '@playwright/test';
import { api } from './utils/apiHelper';
import { handleError } from './utils/errorHandler';

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

test.describe('JSONPlaceholder API Tests', () => {
  test('should get all posts', async () => {
    try {
      const response = await api.get<Post[]>('/posts');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBeTruthy();
      expect(response.data.length).toBeGreaterThan(0);
      
      const firstPost = response.data[0];
      expect(firstPost).toHaveProperty('id');
      expect(firstPost).toHaveProperty('title');
      expect(firstPost).toHaveProperty('body');
      expect(firstPost).toHaveProperty('userId');
    } catch (error) {
      handleError(error);
    }
  });

  test('should create a new post', async () => {
    try {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1
      };

      const response = await api.post<Post>('/posts', newPost);
      expect(response.status).toBe(201);
      expect(response.data).toHaveProperty('id');
      expect(response.data.title).toBe(newPost.title);
      expect(response.data.body).toBe(newPost.body);
    } catch (error) {
      handleError(error);
    }
  });

  test('should update a post', async () => {
    try {
      const updatedPost = {
        title: 'Updated Post',
        body: 'This post has been updated',
        userId: 1
      };

      const response = await api.put<Post>('/posts/1', updatedPost);
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updatedPost.title);
      expect(response.data.body).toBe(updatedPost.body);
    } catch (error) {
      handleError(error);
    }
  });

  test('should delete a post', async () => {
    try {
      const response = await api.delete<{}>('/posts/1');
      expect(response.status).toBe(200);
    } catch (error) {
      handleError(error);
    }
  });

  test('should handle 404 error gracefully', async () => {
    try {
      await api.get('/nonexistent-endpoint');
    } catch (error) {
      expect(error.statusCode).toBe(404);
    }
  });
});