import {getUserFromRequest} from "@/lib/auth";
import {NextRequest, NextResponse} from "next/server";
import {query} from "@/lib/db";
import { setCorsHeaders, corsOptions } from "@/lib/cors";

type Params = {
    params: Promise<{ id: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function PUT(
    request: NextRequest,
    context: Params
) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            const response = NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const { id } = await context.params;
        const notificationId = parseInt(id, 10);

        if (isNaN(notificationId)) {
            const response = NextResponse.json({ error: 'ID de notification invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Mettre à jour la notification pour cet utilisateur spécifique
        const result = await query(
            `UPDATE notification_destinataires
             SET lu = true, date_lecture = NOW()
             WHERE notification_id = $1
               AND destinataire_id = $2
             RETURNING *`,
            [notificationId, user.id]
        );

        // Si aucune ligne n'a été mise à jour, essayer avec destinataire_id NULL (notifications globales)
        if (result.rowCount === 0) {
            await query(
                `UPDATE notification_destinataires
                 SET lu = true, date_lecture = NOW()
                 WHERE notification_id = $1
                   AND destinataire_id IS NULL`,
                [notificationId]
            );
        }

        const response = NextResponse.json({
            success: true,
            message: 'Notification marquée comme lue'
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('Erreur marquage notification:', error);
        const response = NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}