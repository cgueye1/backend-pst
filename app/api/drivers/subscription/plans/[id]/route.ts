import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { query } from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

type Params = {
    params: Promise<{ id: string }>;
};

/**
 * @swagger
 * /api/drivers/subscription/plans/{id}:
 *   delete:
 *     summary: Supprimer une méthode de paiement
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la méthode de paiement sauvegardée (saved_payment_methods.id)
 *     responses:
 *       200:
 *         description: Supprimée
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Introuvable
 *       500:
 *         description: Erreur serveur
 */
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function DELETE(request: NextRequest, context: Params) {
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

        const { id } = await context.params;

        const result = await query(
            `DELETE FROM saved_payment_methods
             WHERE id = $1 AND user_id = $2
                 RETURNING *`,
            [id, user.id]
        );

        if (result.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, message: "Méthode de paiement introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const response = NextResponse.json({
            success: true,
            message: "Méthode de paiement supprimée avec succès"
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur DELETE payment method:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

/**
 * @swagger
 * /api/drivers/subscription/plans/{id}:
 *   put:
 *     summary: Définir une méthode comme par défaut
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la méthode de paiement sauvegardée (saved_payment_methods.id)
 *     responses:
 *       200:
 *         description: OK
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Introuvable
 *       500:
 *         description: Erreur serveur
 */
export async function PUT(request: NextRequest, context: Params) {
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

        const { id } = await context.params;

        // Vérifier que la méthode appartient à l'utilisateur
        const checkResult = await query(
            `SELECT id FROM saved_payment_methods
             WHERE id = $1 AND user_id = $2`,
            [id, user.id]
        );

        if (checkResult.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, message: "Méthode de paiement introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Le trigger se charge de désactiver les autres méthodes
        await query(
            `UPDATE saved_payment_methods
             SET is_default = true
             WHERE id = $1 AND user_id = $2`,
            [id, user.id]
        );

        const response = NextResponse.json({
            success: true,
            message: "Méthode de paiement définie par défaut"
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur SET DEFAULT:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}