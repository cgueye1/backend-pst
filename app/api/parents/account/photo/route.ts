import {NextRequest, NextResponse} from "next/server";
import {getUserFromRequest} from "@/lib/auth";
import {query} from "@/lib/db";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { saveUploadsFile, deleteUploadsByStoredUrl } from "@/lib/storage";
/**
 * @swagger
 * /api/parents/account/photo:
 *   post:
 *     summary: Uploader une photo de profil
 *     description: Upload une nouvelle photo de profil pour le parent.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image (JPG, PNG, WEBP)
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 *   delete:
 *     summary: Supprimer la photo de profil
 *     description: Supprime la photo de profil du parent.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const formData = await request.formData();
        const file = formData.get('photo') as File;

        if (!file) {
            const response = NextResponse.json(
                { success: false, error: 'Aucun fichier fourni' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Validation du fichier
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            const response = NextResponse.json(
                { success: false, error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WEBP' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Limite de taille: 5MB
        if (file.size > 5 * 1024 * 1024) {
            const response = NextResponse.json(
                { success: false, error: 'Le fichier est trop volumineux (max 5MB)' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Générer un nom de fichier unique
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileExtension = file.type.split('/')[1];
        const fileName = `parent_${user.id}_${Date.now()}.${fileExtension}`;

        const oldPhotoResult = await query(
            `SELECT photo_profil FROM users WHERE id = $1`,
            [user.id]
        );

        if (oldPhotoResult.rows[0]?.photo_profil) {
            await deleteUploadsByStoredUrl(oldPhotoResult.rows[0].photo_profil);
        }

        const photoUrl = await saveUploadsFile(
            `parents/${fileName}`,
            buffer,
            file.type || undefined
        );

        // Mettre à jour la base de données
        await query(
            `UPDATE users SET photo_profil = $1 WHERE id = $2`,
            [photoUrl, user.id]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Photo de profil mise à jour',
            data: {
                photo_url: photoUrl
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error) {
        console.error('Erreur upload photo:', error);
        const errorResponse = NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}


export async function DELETE(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer l'URL de la photo actuelle
        const photoResult = await query(
            `SELECT photo_profil FROM users WHERE id = $1`,
            [user.id]
        );

        if (photoResult.rows[0]?.photo_profil) {
            await deleteUploadsByStoredUrl(photoResult.rows[0].photo_profil);
        }

        // Supprimer de la base de données
        await query(
            `UPDATE users SET photo_profil = NULL WHERE id = $1`,
            [user.id]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Photo de profil supprimée'
        });
        return setCorsHeaders(response, origin);

    } catch (error) {
        console.error('Erreur suppression photo:', error);
        const errorResponse = NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
