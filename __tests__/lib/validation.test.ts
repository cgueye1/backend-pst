import { z } from 'zod';
import { validateData } from '../../lib/validation';
import { NextRequest } from 'next/server';

describe('Validation', () => {
  const testSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    age: z.number().min(18)
  });

  it('should validate correct data', () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 25
    };

    const result = validateData(testSchema, validData, 'http://localhost:3000');

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(validData);
    }
  });

  it('should reject invalid data', () => {
    const invalidData = {
      name: '',
      email: 'invalid-email',
      age: 15
    };

    const result = validateData(testSchema, invalidData, 'http://localhost:3000');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.response.status).toBe(400);
    }
  });

  it('should handle missing required fields', () => {
    const incompleteData = {
      name: 'John Doe'
      // Missing email and age
    };

    const result = validateData(testSchema, incompleteData, 'http://localhost:3000');

    expect(result.success).toBe(false);
  });
});



















