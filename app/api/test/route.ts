import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    
    try {
        // Test de base
        const healthCheck = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            server: 'Next.js API',
            checks: {
                env: {
                    DATABASE_URL: !!process.env.DATABASE_URL ? '✅ Défini' : '❌ Manquant',
                    JWT_SECRET: !!process.env.JWT_SECRET ? '✅ Défini' : '❌ Manquant',
                    NODE_ENV: process.env.NODE_ENV || 'non défini'
                }
            }
        };

        const response = NextResponse.json(healthCheck);
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        const response = NextResponse.json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

