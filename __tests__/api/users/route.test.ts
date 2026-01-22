import { GET, POST } from '../../../app/api/users/route';
import { NextRequest } from 'next/server';
import { authMiddleware } from '../../../lib/auth';
import { getAllUsers, createUser } from '../../../services/userServices';

// Mock dependencies
jest.mock('../../../lib/auth');
jest.mock('../../../services/userServices');

const mockAuthMiddleware = authMiddleware as jest.MockedFunction<typeof authMiddleware>;
const mockGetAllUsers = getAllUsers as jest.MockedFunction<typeof getAllUsers>;
const mockCreateUser = createUser as jest.MockedFunction<typeof createUser>;

describe('API /api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users for admin', async () => {
      const mockUser = {
        id: 1,
        role: 'admin',
        email: 'admin@example.com'
      };

      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com', role: 'admin' },
        { id: 2, name: 'User 2', email: 'user2@example.com', role: 'parent' }
      ];

      mockAuthMiddleware.mockReturnValue(mockUser as any);
      mockGetAllUsers.mockResolvedValue(mockUsers as any);

      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
    });

    it('should return 403 for non-admin users', async () => {
      const mockUser = {
        id: 2,
        role: 'parent',
        email: 'parent@example.com'
      };

      mockAuthMiddleware.mockReturnValue(mockUser as any);

      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toHaveProperty('error');
    });

    it('should return 401 for unauthenticated users', async () => {
      mockAuthMiddleware.mockImplementation(() => {
        throw new Error('Unauthorized');
      });

      const request = new NextRequest('http://localhost:3000/api/users');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data).toHaveProperty('error');
    });
  });

  describe('POST /api/users', () => {
    it('should create user successfully', async () => {
      const mockAdmin = {
        id: 1,
        role: 'admin',
        email: 'admin@example.com'
      };

      const newUserData = {
        name: 'New User',
        email: 'newuser@example.com',
        role: 'parent',
        phone: '1234567890'
      };

      const createdUser = {
        id: 3,
        ...newUserData,
        status: 'active',
        created_at: new Date()
      };

      mockAuthMiddleware.mockReturnValue(mockAdmin as any);
      mockCreateUser.mockResolvedValue(createdUser as any);

      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify(newUserData),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('user');
      expect(data.user.email).toBe(newUserData.email);
      expect(mockCreateUser).toHaveBeenCalledWith(expect.objectContaining(newUserData));
    });

    it('should return 403 for non-admin users', async () => {
      const mockUser = {
        id: 2,
        role: 'parent',
        email: 'parent@example.com'
      };

      mockAuthMiddleware.mockReturnValue(mockUser as any);

      const request = new NextRequest('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify({ name: 'Test', email: 'test@example.com' })
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toHaveProperty('error');
    });
  });
});

