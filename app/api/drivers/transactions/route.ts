import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/drivers/transactions:
 *   get:
 *     summary: Historique des transactions du chauffeur
 *     tags: [CHAUFFEUR]
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== "driver") {
            const response = NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const res = await query(
            `
            SELECT 
                p.id,
                p.transaction_id,
                p.amount,
                p.status,
                p.method,
                p.payment_provider,
                p.mobile_number,
                p.created_at,
                sp.name AS plan_name,
                sp.duration_days
            FROM payments p
            LEFT JOIN subscriptions s ON s.payment_id = p.id
            LEFT JOIN subscription_plans sp ON sp.id = s.plan_id
            WHERE p.user_id = $1
            ORDER BY p.created_at DESC
            `,
            [user.id]
        );

        const response = NextResponse.json({
            success: true,
            count: res.rowCount,
            transactions: res.rows
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur historique transactions:", error);

        const errorResponse = NextResponse.json(
            {
                success: false,
                message: "Erreur lors de la récupération de l'historique"
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
