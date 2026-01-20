
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

/**
 * @swagger
 * /api/parents/children/{childId}/location:
 *   put:
 *     summary: Associer une école et une adresse de domicile à un enfant
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */

type Params = {
    params: Promise<{ childId: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PUT(
    req: NextRequest,
    context: Params
) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== "parent") {
            const response = NextResponse.json(
                { success: false, error: "Non autorisé" },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        const { childId: childIdStr } = await context.params;
        const childId = Number(childIdStr);
        const { school_id, address } = await req.json();

        if (!school_id || !address) {
            const response = NextResponse.json(
                { success: false, error: "school_id et address sont requis" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que l'enfant appartient au parent
        const childCheck = await query(
            `SELECT * FROM children WHERE id = $1 AND parent_id = $2`,
            [childId, user.id]
        );

        if (childCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: "Enfant introuvable ou non autorisé" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Vérifier que l'école existe
        const schoolCheck = await query(
            `SELECT id FROM schools WHERE id = $1`,
            [school_id]
        );

        if (schoolCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, error: "École introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Mise à jour
        const result = await query(
            `
      UPDATE children
      SET school_id = $1,
          address = $2
      WHERE id = $3
      RETURNING *
      `,
            [school_id, address, childId]
        );

        const response = NextResponse.json({
            success: true,
            message: "École et adresse associées avec succès",
            data: result.rows[0],
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("❌ Erreur association école/adresse :", error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                error: "Erreur serveur",
                details: error.message,
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
