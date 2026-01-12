
import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";

/**
 * @swagger
 * /api/parents/children/{childId}/location:
 *   put:
 *     summary: Associer une école et une adresse de domicile à un enfant
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 */

export async function PUT(
    req: NextRequest,
    { params }: { params: { childId: string } }
) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== "parent") {
            return NextResponse.json(
                { success: false, error: "Non autorisé" },
                { status: 401 }
            );
        }

        const childId = Number(params.childId);
        const { school_id, address } = await req.json();

        if (!school_id || !address) {
            return NextResponse.json(
                { success: false, error: "school_id et address sont requis" },
                { status: 400 }
            );
        }

        // Vérifier que l’enfant appartient au parent
        const childCheck = await query(
            `SELECT * FROM children WHERE id = $1 AND parent_id = $2`,
            [childId, user.id]
        );

        if (childCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: "Enfant introuvable ou non autorisé" },
                { status: 404 }
            );
        }

        // Vérifier que l’école existe
        const schoolCheck = await query(
            `SELECT id FROM schools WHERE id = $1`,
            [school_id]
        );

        if (schoolCheck.rowCount === 0) {
            return NextResponse.json(
                { success: false, error: "École introuvable" },
                { status: 404 }
            );
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

        return NextResponse.json({
            success: true,
            message: "École et adresse associées avec succès",
            data: result.rows[0],
        });

    } catch (error: any) {
        console.error("❌ Erreur association école/adresse :", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erreur serveur",
                details: error.message,
            },
            { status: 500 }
        );
    }
}
