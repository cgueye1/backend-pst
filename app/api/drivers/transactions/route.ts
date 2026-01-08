import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

/**
 * @swagger
 * /api/drivers/transactions:
 *   get:
 *     summary: Historique des transactions du chauffeur
 *     tags: [CHAUFFEUR]
 */
export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== "driver") {
            return NextResponse.json(
                { success: false, message: "Non autorisé" },
                { status: 403 }
            );
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

        return NextResponse.json({
            success: true,
            count: res.rowCount,
            transactions: res.rows
        });

    } catch (error: any) {
        console.error("Erreur historique transactions:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Erreur lors de la récupération de l'historique"
            },
            { status: 500 }
        );
    }
}
