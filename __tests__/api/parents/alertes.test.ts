import { GET } from '../../../app/api/parents/alertes/route';
import { NextRequest } from 'next/server';
import { query } from '../../../lib/db';

// Mock dependencies
jest.mock('../../../lib/db');

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('API /api/parents/alertes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 without authorization', async () => {
    const request = new NextRequest('http://localhost:3000/api/parents/alertes');
    
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('should send trip reminders successfully', async () => {
    process.env.CRON_SECRET = 'test-secret';

    const mockTrips = [
      {
        trip_id: 1,
        departure_time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        start_point: 'Point A',
        end_point: 'Point B',
        parent_id: 1,
        name: 'Parent Name',
        email: 'parent@example.com',
        phone: '1234567890',
        driver_id: 2
      }
    ];

    // Mock query for finding trips
    mockQuery.mockResolvedValueOnce({
      rows: mockTrips,
      rowCount: 1
    } as any);

    // Mock query for creating notification
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 100 }],
      rowCount: 1
    } as any);

    // Mock query for creating destinataire
    mockQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 1
    } as any);

    const request = new NextRequest('http://localhost:3000/api/parents/alertes', {
      headers: {
        'authorization': 'Bearer test-secret'
      }
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data.notifications_sent).toBe(1);
  });

  it('should not send duplicate reminders', async () => {
    process.env.CRON_SECRET = 'test-secret';

    // Mock query returns empty (no trips needing reminders)
    mockQuery.mockResolvedValueOnce({
      rows: [],
      rowCount: 0
    } as any);

    const request = new NextRequest('http://localhost:3000/api/parents/alertes', {
      headers: {
        'authorization': 'Bearer test-secret'
      }
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data.notifications_sent).toBe(0);
  });
});



















