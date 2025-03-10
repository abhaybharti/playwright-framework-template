import { test, expect } from '@playwright/test';
import { ApiHelper } from '../../../helper/api/apiHelper';

test.describe('Posts API', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request }) => {
    apiHelper = new ApiHelper(request);
  });

  test('should get all posts', async () => {
    const response = await apiHelper.get('/posts');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('should get a single post', async () => {
    const response = await apiHelper.get('/posts/1');
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
    expect(response.data.title).toBeTruthy();
    expect(response.data.body).toBeTruthy();
  });

  test('should create a new post', async () => {
    const postData = {
      title: 'Test Post',
      body: 'This is a test post',
      userId: 1
    };
    const response = await apiHelper.post('/posts', postData);
    expect(response.status).toBe(201);
    expect(response.data.title).toBe(postData.title);
    expect(response.data.body).toBe(postData.body);
    expect(response.data.userId).toBe(postData.userId);
    expect(response.data.id).toBeTruthy();
  });

  test('should update a post', async () => {
    const updateData = {
      title: 'Updated Post',
      body: 'This post has been updated',
      userId: 1
    };
    const response = await apiHelper.put('/posts/1', updateData);
    expect(response.status).toBe(200);
    expect(response.data.title).toBe(updateData.title);
    expect(response.data.body).toBe(updateData.body);
  });

  test('should delete a post', async () => {
    const response = await apiHelper.delete('/posts/1');
    expect(response.status).toBe(200);
  });
});