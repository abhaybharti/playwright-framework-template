import { test, expect } from '@playwright/test';
import { ApiHelper } from '@src/helper/api/apiHelper';


test.describe('Users API', () => {
  let apiHelper: ApiHelper;

  test.beforeEach(async ({ request,page }) => {
    apiHelper = new ApiHelper(page,request);
  });

  test('should get all users', async () => {
    const response = await apiHelper.get('/users');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBeTruthy();
    expect(response.data.length).toBeGreaterThan(0);
  });

  test('should get a single user', async () => {
    const response = await apiHelper.get('/users/1');
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(1);
    expect(response.data.name).toBeTruthy();
    expect(response.data.email).toBeTruthy();
  });

  test('should create a new user', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      username: 'johndoe',
      website: 'example.com'
    };
    const response = await apiHelper.post('/users', userData);
    expect(response.status).toBe(201);
    expect(response.data.name).toBe(userData.name);
    expect(response.data.email).toBe(userData.email);
    expect(response.data.id).toBeTruthy();
  });

  test('should update a user', async () => {
    const updateData = {
      name: 'Jane Doe',
      email: 'jane@example.com'
    };
    const response = await apiHelper.patch('/users/1', updateData);
    expect(response.status).toBe(200);
    expect(response.data.name).toBe(updateData.name);
    expect(response.data.email).toBe(updateData.email);
  });
});