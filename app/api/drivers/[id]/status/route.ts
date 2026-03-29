/**
 * @swagger
 * /api/drivers/{id}/status:
 *   patch:
 *     summary: Mettre à jour le statut d'un chauffeur (admin uniquement)
 *     description: >
 *       Permet à un administrateur de changer le statut d'un chauffeur.
 *       Les valeurs acceptées sont "Approuvé" (ou "approved") et "Refusé" (ou "rejected").
 *       Une notification est envoyée aux admins lors du changement de statut.
 *     tags: [ADMIN]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du chauffeur
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approuvé, approved, Refusé, rejected]
 *                 description: Nouveau statut du chauffeur (accepte français ou anglais)
 *                 example: "Approuvé"
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 user_id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                   enum: [En attente, Approuvé, Refusé]
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid status. Must be 'Approuvé'/'approved' or 'Refusé'/'rejected'"
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (admin uniquement)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Accès refusé"
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from "next/server";
import { updateDriverStatus } from "@/services/driverServices";
import { authMiddleware } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> } | { params: { id: string } }
) {
    const origin = req.headers.get('origin');
    // Gérer les params comme Promise ou objet direct (selon la version de Next.js)
    const params = 'then' in context.params
        ? await context.params
        : context.params;
    try {
        console.log('PATCH /api/drivers/[messageId]]/status - Début');
        console.log('Params:', params);

        // Vérifier l'authentification
        let user;
        try {
            user = authMiddleware(req);
            console.log('User authenticated:', user?.id, user?.role);
        } catch (error: any) {
            console.error('Auth error:', error.message);
            const response = NextResponse.json({ error: "Non autorisé" }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        if (!user || user.role !== "admin") {
            console.log('Access denied - role:', user?.role);
            const response = NextResponse.json({ error: "Accès refusé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const driverId = Number(params.id);
        if (Number.isNaN(driverId)) {
            const response = NextResponse.json({ error: "Invalid driver id" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        console.log('Request body:', body);
        const { status } = body;

        // Accepter les valeurs en français ou en anglais
        let statusValue: 'Approuvé' | 'Refusé';
        if (status === 'Approuvé' || status === 'approved') {
            statusValue = 'Approuvé';
        } else if (status === 'Refusé' || status === 'rejected') {
            statusValue = 'Refusé';
        } else {
            const response = NextResponse.json({ error: "Invalid status. Must be 'Approuvé'/'approved' or 'Refusé'/'rejected'" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        console.log('Updating driver', driverId, 'to status', statusValue);
        const res = await updateDriverStatus(driverId, statusValue);
        console.log('Update successful:', res);

        const response = NextResponse.json(res);
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('Error updating driver status:', error);
        const response = NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}
