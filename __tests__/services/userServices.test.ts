import { createUser, getAllUsers, getUserById, updateUser, deleteUser, getUserByEmail } from '../../services/userServices';
import { query } from '../../lib/db';
import bcrypt from 'bcrypt';
import { notifyAdmins } from '../../services/notificationService';

// Mock dependencies
jest.mock('../../lib/db');
jest.mock('bcrypt');
jest.mock('../../services/notificationService');

const mockQuery = query as jest.MockedFunction<typeof query>;
const mockBcryptHash = bcrypt.hash as jest.MockedFunction<typeof bcrypt.hash>;
const mockNotifyAdmins = notifyAdmins as jest.MockedFunction<typeof notifyAdmins>;

describe('User Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a user with default password for driver role', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'driver',
        phone: '1234567890'
      };

      // mockBcryptHash.mockResolvedValue("hashed_password");
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'driver',
          phone: '1234567890',
          status: 'active',
          created_at: new Date()
        }],
        rowCount: 1
      } as any);

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      } as any);

      mockNotifyAdmins.mockResolvedValue();

      const result = await createUser(userData);

      expect(mockBcryptHash).toHaveBeenCalledWith('driver123', 10);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([userData.name, userData.email, 'hashed_password', 'driver'])
      );
      expect(result).toHaveProperty('id', 1);
      expect(result).toHaveProperty('generatedPassword', 'driver123');
    });

    it('should create a user with provided password', async () => {
      const userData = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'parent',
        phone: '0987654321',
        password: 'customPassword123'
      };

      // mockBcryptHash.mockResolvedValue('hashed_custom_password');
      mockQuery.mockResolvedValueOnce({
        rows: [{
          id: 2,
          name: 'Jane Doe',
          email: 'jane@example.com',
          role: 'parent',
          phone: '0987654321',
          status: 'active',
          created_at: new Date()
        }],
        rowCount: 1
      } as any);

      const result = await createUser(userData);

      expect(mockBcryptHash).toHaveBeenCalledWith('customPassword123', 10);
      expect(result).not.toHaveProperty('generatedPassword');
    });

    it('should create driver entry when role is driver', async () => {
      const userData = {
        name: 'Driver Test',
        email: 'driver@example.com',
        role: 'driver'
      };

      // mockBcryptHash.mockResolvedValue("hashed_password");
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 3 }],
        rowCount: 1
      } as any);

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      } as any);

      mockNotifyAdmins.mockResolvedValue();

      await createUser(userData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO drivers'),
        expect.arrayContaining([3])
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', email: 'user1@example.com', role: 'admin' },
        { id: 2, name: 'User 2', email: 'user2@example.com', role: 'parent' }
      ];

      mockQuery.mockResolvedValueOnce({
        rows: mockUsers,
        rowCount: 2
      } as any);

      const result = await getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id, name, email')
      );
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockUser],
        rowCount: 1
      } as any);

      const result = await getUserById(1);

      expect(result).toEqual(mockUser);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id=$1'),
        [1]
      );
    });

    it('should return null if user not found', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      } as any);

      const result = await getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin'
      };

      mockQuery.mockResolvedValueOnce({
        rows: [mockUser],
        rowCount: 1
      } as any);

      const result = await getUserByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE email=$1'),
        ['test@example.com']
      );
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const existingUser = {
        id: 1,
        name: 'Old Name',
        email: 'old@example.com',
        role: 'parent',
        phone: '123',
        status: 'active'
      };

      const updateData = {
        name: 'New Name',
        status: 'inactive'
      };

      mockQuery.mockResolvedValueOnce({
        rows: [existingUser],
        rowCount: 1
      } as any);

      mockQuery.mockResolvedValueOnce({
        rows: [{
          ...existingUser,
          ...updateData
        }],
        rowCount: 1
      } as any);

      mockNotifyAdmins.mockResolvedValue();

      const result = await updateUser(1, updateData);

      expect(result.name).toBe('New Name');
      expect(result.status).toBe('inactive');
    });

    it('should notify admins when status changes', async () => {
      const existingUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'parent',
        status: 'active'
      };

      mockQuery.mockResolvedValueOnce({
        rows: [existingUser],
        rowCount: 1
      } as any);

      mockQuery.mockResolvedValueOnce({
        rows: [{ ...existingUser, status: 'inactive' }],
        rowCount: 1
      } as any);

      mockNotifyAdmins.mockResolvedValue();

      await updateUser(1, { status: 'inactive' });

      expect(mockNotifyAdmins).toHaveBeenCalledWith(
        'Changement de statut utilisateur',
        expect.any(String),
        expect.stringContaining('Test User'),
        undefined
      );
    });

    it('should throw error if user not found', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      } as any);

      await expect(updateUser(999, { name: 'New Name' })).rejects.toThrow('User not found');
    });
  });

  describe('deleteUser', () => {
    it('should delete user and notify admins', async () => {
      const userToDelete = {
        id: 1,
        name: 'User To Delete',
        email: 'delete@example.com',
        role: 'parent'
      };

      mockQuery.mockResolvedValueOnce({
        rows: [userToDelete],
        rowCount: 1
      } as any);

      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      } as any);

      mockNotifyAdmins.mockResolvedValue();

      const result = await deleteUser(1);

      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users'),
        [1]
      );
      expect(mockNotifyAdmins).toHaveBeenCalled();
    });
  });
});



















