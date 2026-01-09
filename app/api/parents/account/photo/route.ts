import {NextRequest, NextResponse} from "next/server";
import {getUserFromRequest} from "@/lib/auth";
import {unlink, writeFile} from "fs/promises";
import path, {join} from "path";
import {query} from "@/lib/db";


// Créer le dossier si nécessaire
import fs from "fs";

/**
 * @swagger
 * /api/parents/account/photo:
 *   put:
 *     summary: Modifier la photo de profil
 *     tags: [Parents]
 *   delete:
 *       summary: Supprimer la photo de profil
 *       tags: [Parents]
 */
export async function POST(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('photo') as File;

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'Aucun fichier fourni' },
                { status: 400 }
            );
        }

        // Validation du fichier
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Type de fichier non autorisé. Utilisez JPG, PNG ou WEBP' },
                { status: 400 }
            );
        }

        // Limite de taille: 5MB
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { success: false, error: 'Le fichier est trop volumineux (max 5MB)' },
                { status: 400 }
            );
        }

        // Générer un nom de fichier unique
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const fileExtension = file.type.split('/')[1];
        const fileName = `parent_${user.id}_${Date.now()}.${fileExtension}`;
        const uploadDir = path.join(process.cwd(), "/uploads/parents");
        const filePath = join(uploadDir, fileName);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Supprimer l'ancienne photo si elle existe
        const oldPhotoResult = await query(
            `SELECT photo_profil FROM users WHERE id = $1`,
            [user.id]
        );

        if (oldPhotoResult.rows[0]?.photo_profil) {
            const oldPhotoPath = join(process.cwd(), 'public', oldPhotoResult.rows[0].photo_profil);
            try {
                await unlink(oldPhotoPath);
            } catch (err) {
                console.log('Ancienne photo non trouvée ou déjà supprimée');
            }
        }

        // Sauvegarder le nouveau fichier
        await writeFile(filePath, buffer);

        const photoUrl = `/uploads/parents/${fileName}`;

        // Mettre à jour la base de données
        await query(
            `UPDATE users SET photo_profil = $1 WHERE id = $2`,
            [photoUrl, user.id]
        );

        return NextResponse.json({
            success: true,
            message: 'Photo de profil mise à jour',
            data: {
                photo_url: photoUrl
            }
        });

    } catch (error) {
        console.error('Erreur upload photo:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}


export async function DELETE(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
        }

        // Récupérer l'URL de la photo actuelle
        const photoResult = await query(
            `SELECT photo_profil FROM users WHERE id = $1`,
            [user.id]
        );

        if (photoResult.rows[0]?.photo_profil) {
            const photoPath = join(process.cwd(), 'public', photoResult.rows[0].photo_profil);

            try {
                await unlink(photoPath);
            } catch (err) {
                console.log('Photo non trouvée sur le disque');
            }
        }

        // Supprimer de la base de données
        await query(
            `UPDATE users SET photo_profil = NULL WHERE id = $1`,
            [user.id]
        );

        return NextResponse.json({
            success: true,
            message: 'Photo de profil supprimée'
        });

    } catch (error) {
        console.error('Erreur suppression photo:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}
