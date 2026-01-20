import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

type Params = {
    params: Promise<{ id: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(
    request: NextRequest,
    context: Params
) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
        }

        const notificationId = await context.params;

        // Recuperer la notification
        const notifResult = await query(
            `SELECT
                n.*,
                u.name as emetteur_nom
             FROM notifications n
             LEFT JOIN users u ON n.emetteur_id = u.id
             WHERE n.id = $1`,
            [notificationId]
        );

        if (notifResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Notification non trouvee' },
                { status: 404 }
            );
        }

        // Recuperer les destinataires
        const destResult = await query(
            `SELECT
                nd.*,
                  u.name as destinataire_nom
             FROM notification_destinataires nd
             LEFT JOIN users u ON nd.destinataire_id = u.id
             WHERE nd.notification_id = $1`,
            [notificationId]
        );

        const notification = notifResult.rows[0];
        notification.destinataires = destResult.rows;

        const response = NextResponse.json(notification);
        return setCorsHeaders(response, request.headers.get('origin'));
    } catch (error) {
        console.error('Erreur recuperation notification:', error);
        const response = NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        return setCorsHeaders(response, request.headers.get('origin'));
    }
}

// PUT: Mettre a jour une notification
export async function PUT(
    request: NextRequest,
    context: Params
) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            const response = NextResponse.json({ error: 'Non autorise' }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const { id } = await context.params;
        const notificationId = Number(id);

        if (isNaN(notificationId)) {
            const response = NextResponse.json({ error: 'ID invalide' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Verifier que la notification existe et appartient a l'utilisateur
        const notifCheck = await query(
            `SELECT emetteur_id FROM notifications WHERE id = $1`,
            [notificationId]
        );

        if (notifCheck.rows.length === 0) {
            const response = NextResponse.json(
                { error: 'Notification non trouvee' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // Verifier que l'utilisateur est l'emetteur (ou admin)
        if (notifCheck.rows[0].emetteur_id !== user.id && user.role !== 'admin') {
            const response = NextResponse.json(
                { error: 'Vous n\'etes pas autorise a modifier cette notification' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const { libelle, type, description, imageUrl, destinataireIds, sendToAll } =
            await request.json();

        if (!libelle || !type || !description) {
            const response = NextResponse.json(
                { error: 'Champs requis manquants (libelle, type, description)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        try {
            // DEBUT Transaction
            await query('BEGIN');

            // Mettre a jour la notification
            await query(
                `UPDATE notifications
                 SET libelle = $1, type = $2, description = $3, image_url = $4
                 WHERE id = $5`,
                [libelle, type, description, imageUrl || null, notificationId]
            );

            // Supprimer les anciens destinataires
            await query(
                `DELETE FROM notification_destinataires WHERE notification_id = $1`,
                [notificationId]
            );

            // Inserer les nouveaux destinataires
            if (sendToAll === true) {
                // Pour TOUS les utilisateurs
                await query(
                    `INSERT INTO notification_destinataires
                         (notification_id, destinataire_id, lu)
                     VALUES ($1, NULL, false)`,
                    [notificationId]
                );
            } else if (destinataireIds && destinataireIds.length > 0) {
                // Pour des utilisateurs specifiques
                for (const userId of destinataireIds) {
                    await query(
                        `INSERT INTO notification_destinataires
                         (notification_id, destinataire_id, lu)
                         VALUES ($1, $2, false)`,
                        [notificationId, userId]
                    );
                }
            } else {
                // Aucun destinataire selectionne - erreur
                await query('ROLLBACK');
                const response = NextResponse.json(
                    { error: 'Veuillez selectionner au moins un destinataire ou cocher "Envoyer a tous"' },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            await query('COMMIT');

            // Récupérer la notification mise à jour avec l'image
            const updatedNotif = await query(
                `SELECT id, libelle, type, description, image_url as "imageUrl", 
                        emetteur_id, date_creation, nb_destinataires
                 FROM notifications WHERE id = $1`,
                [notificationId]
            );

            const response = NextResponse.json(
                updatedNotif.rows[0] || {
                    success: true,
                    message: 'Notification mise a jour avec succes',
                    notificationId,
                },
                { status: 200 }
            );
            return setCorsHeaders(response, origin);
        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }
    } catch (error: any) {
        console.error('Erreur mise a jour notification:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

// SUPPRIMER NOTIFICATION
export async function DELETE(
    request: NextRequest,
    context: Params
) {
    try {
        const user = await getUserFromRequest(request);

        if (!user) {
            return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
        }

        const notificationId = await context.params;

        await query(
            `UPDATE notifications SET statut = 'inactive' WHERE id = $1`,
            [notificationId]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Notification supprimee avec succes'
        });
        return setCorsHeaders(response, request.headers.get('origin'));
    } catch (error) {
        console.error('Erreur suppression notification:', error);
        const response = NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        return setCorsHeaders(response, request.headers.get('origin'));
    }
}
