import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/drivers/trips:
 *   get:
 *     summary: Récupérer LA Liste des trajets du chauffeur CONNECTE
 *     tags: [CHAUFFEUR]
 *
 *   post:
 *     summary: Créer un nouveau trajet
 *     tags: [CHAUFFEUR]
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver_id depuis la table drivers
        const driverResult = await query(
            `SELECT id FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: "Chauffeur introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driverId = driverResult.rows[0].id;

        //  Récupérer les query params
        const { searchParams } = new URL(request.url);

        const status = searchParams.get("status");
        const date_from = searchParams.get("date_from");
        const date_to = searchParams.get("date_to");
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 20);
        const offset = (page - 1) * limit;

        let whereClause = "WHERE t.driver_id = $1";
        const params: any[] = [driverId];
        let paramIndex = 2;

        if (status) {
            whereClause += ` AND t.status = $${paramIndex++}`;
            params.push(status);
        }

        if (date_from) {
            whereClause += ` AND t.departure_time >= $${paramIndex++}`;
            params.push(date_from);
        }

        if (date_to) {
            whereClause += ` AND t.departure_time <= $${paramIndex++}`;
            params.push(date_to);
        }

        const trips = await query(
            `
      SELECT t.*
      FROM trips t
      ${whereClause}
      ORDER BY t.departure_time DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `,
            [...params, limit, offset]
        );

        const response = NextResponse.json({
            success: true,
            data: trips.rows,
        });
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== 'driver') {
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer le driver_id depuis la table drivers
        const driverResult = await query(
            `SELECT id, status, capacity FROM drivers WHERE user_id = $1`,
            [user.id]
        );

        if (driverResult.rowCount === 0) {
            const response = NextResponse.json({ error: "Chauffeur introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const driver = driverResult.rows[0];
        if (driver.status !== 'Approuvé') {
            const response = NextResponse.json(
                { error: "Votre compte chauffeur est en attente d'approbation" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const driverId = driver.id;

        const body = await request.json();
        const { start_point, end_point, departure_time, capacity_max, school_id, is_recurring } = body;

        if (!start_point || !end_point || !departure_time || !capacity_max) {
            const response = NextResponse.json(
                { success: false, message: "Champs obligatoires manquants" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que la capacité du trajet ne dépasse pas celle du véhicule
        const capacityMaxNum = Number(capacity_max);
        if (isNaN(capacityMaxNum) || capacityMaxNum <= 0) {
            const response = NextResponse.json(
                { success: false, message: "La capacité doit être un nombre positif" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        if (capacityMaxNum > driver.capacity) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: `La capacité du trajet (${capacityMaxNum}) dépasse celle de votre véhicule (${driver.capacity})`
                },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que le trajet n'est pas dans le passé
        const departureDate = new Date(departure_time);
        if (departureDate < new Date()) {
            const response = NextResponse.json(
                { success: false, message: "Impossible de créer un trajet dans le passé" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const result = await query(
            `
                INSERT INTO trips (driver_id, school_id, start_point, end_point, departure_time, capacity_max, is_recurring, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
                    RETURNING *
            `,
            [driverId, school_id, start_point, end_point, departure_time, capacityMaxNum, is_recurring || false]
        );

        const response = NextResponse.json(
            { success: true, data: result.rows[0] },
            { status: 201 }
        );
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
