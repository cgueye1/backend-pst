 import { GET } from "@/app/api/drivers/subscription/alertes/route";
import { NextRequest } from 'next/server';
import { query } from '@/lib/db';

// Mock dependencies
jest.mock('../../../lib/db');

const mockQuery = query as jest.MockedFunction<typeof query>;

describe('API /api/drivers/subscription/alertes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 without authorization header', async () => {
    const request = new NextRequest('http://localhost:3000/api/drivers/subscription/alertes');
    
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.success).toBe(false);
    expect(data.message).toContain('Non autorisé');
  });

  it('should return 401 with invalid secret', async () => {
    const request = new NextRequest('http://localhost:3000/api/drivers/subscription/alertes', {
      headers: {
        'authorization': 'Bearer wrong-secret'
      }
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
  });

  it('should process subscriptions successfully with valid secret', async () => {
    process.env.CRON_SECRET = 'test-secret';

    // Mock queries for subscription checks
    mockQuery.mockResolvedValueOnce({
      rows: [], // expiringSoonResult
      rowCount: 0
    } as any);

    mockQuery.mockResolvedValueOnce({
      rows: [], // expiringTodayResult
      rowCount: 0
    } as any);

    mockQuery.mockResolvedValueOnce({
      rows: [], // expiredResult
      rowCount: 0
    } as any);

    mockQuery.mockResolvedValueOnce({
      rows: [], // autoRenewResult
      rowCount: 0
    } as any);

    const request = new NextRequest('http://localhost:3000/api/drivers/subscription/alertes', {
      headers: {
        'authorization': 'Bearer test-secret'
      }
    });

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('expiring_soon');
    expect(data.data).toHaveProperty('expiring_today');
    expect(data.data).toHaveProperty('expired');
    expect(data.data).toHaveProperty('auto_renewed');
  });

  it('should accept secret via query parameter', async () => {
    process.env.CRON_SECRET = 'test-secret';

    mockQuery.mockResolvedValue({
      rows: [],
      rowCount: 0
    } as any);

    const request = new NextRequest('http://localhost:3000/api/drivers/subscription/alertes?cron_secret=test-secret');

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
  });
});

