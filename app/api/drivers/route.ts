/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Récupérer tous les chauffeurs
 *     tags: [ADMIN]

 *
 *   post:
 *     summary: Créer un nouveau chauffeur
 *     tags: [ADMIN]

 */
import { NextRequest, NextResponse } from "next/server";
import { getAllDrivers, createDriver } from "@/services/driverServices";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const drivers = await getAllDrivers();
        const response = NextResponse.json(drivers);
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const data = await req.json();
        const driver = await createDriver(data);
        const response = NextResponse.json(driver, { status: 201 });
        return setCorsHeaders(response, origin);
    } catch (err) {
        const response = NextResponse.json({ error: String(err) }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
