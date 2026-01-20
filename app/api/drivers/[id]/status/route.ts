/**
 * @swagger
 * /api/drivers/{id}/status:
*   patch:
    *     summary: Mettre à jour le statut d'un chauffeur (admin uniquement)
*     tags: [ADMIN]

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

