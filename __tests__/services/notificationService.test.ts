import { notifyAdmins, AdminNotificationTypes } from '../../services/notificationService';
import { query } from '../../lib/db';

// Mock dependencies
jest.mock('../../lib/db');

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('Notification Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('notifyAdmins', () => {
    it('should create notification and send to all admins', async () => {
      const adminIds = [1, 2, 3];
      
      // Mock getAdminIds (first query)
      mockQuery.mockResolvedValueOnce({
        rows: adminIds.map(id => ({ id })),
        rowCount: adminIds.length
      } as any);

      // Mock create notification (second query)
      mockQuery.mockResolvedValueOnce({
        rows: [{ id: 100 }],
        rowCount: 1
      } as any);

      // Mock insert destinataires (multiple calls)
      adminIds.forEach(() => {
        mockQuery.mockResolvedValueOnce({
          rows: [],
          rowCount: 1
        } as any);
      });

      // Mock verification query
      mockQuery.mockResolvedValueOnce({
        rows: [{ count: '3' }],
        rowCount: 1
      } as any);

      await notifyAdmins(
        'Test Notification',
        AdminNotificationTypes.NEW_DRIVER_REGISTRATION,
        'Test description',
        5
      );

      // Verify notification was created
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO notifications'),
        ['Test Notification', AdminNotificationTypes.NEW_DRIVER_REGISTRATION, 'Test description', 5]
      );

      // Verify notifications were sent to all admins
      expect(mockQuery).toHaveBeenCalledTimes(5 + adminIds.length); // getAdminIds + create + 3 inserts + verify
    });

    it('should handle case when no admins exist', async () => {
      mockQuery.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      } as any);

      await notifyAdmins(
        'Test Notification',
        AdminNotificationTypes.NEW_DRIVER_REGISTRATION,
        'Test description'
      );

      // Should not create notification if no admins
      expect(mockQuery).toHaveBeenCalledTimes(1); // Only getAdminIds
      expect(mockQuery).not.toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO notifications'),
        expect.any(Array)
      );
    });

    it('should handle errors gracefully', async () => {
      mockQuery.mockRejectedValueOnce(new Error('Database error'));

      // Should not throw, just log error
      await expect(notifyAdmins(
        'Test Notification',
        AdminNotificationTypes.NEW_DRIVER_REGISTRATION,
        'Test description'
      )).resolves.not.toThrow();
    });
  });

  describe('AdminNotificationTypes', () => {
    it('should have all required notification types', () => {
      expect(AdminNotificationTypes.NEW_DRIVER_REGISTRATION).toBe('new_driver_registration');
      expect(AdminNotificationTypes.NEW_PARENT_REGISTRATION).toBe('new_parent_registration');
      expect(AdminNotificationTypes.USER_STATUS_CHANGE).toBe('user_status_change');
      expect(AdminNotificationTypes.INCIDENT_RESOLVED).toBe('incident_resolved');
      expect(AdminNotificationTypes.SUBSCRIPTION_EXPIRED).toBe('subscription_expired');
    });
  });
});

