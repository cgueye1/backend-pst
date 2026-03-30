/**
 * @swagger
 * /api/notifications/upload:
 *   post:
 *     summary: Upload fichier notification
 *     description: Upload un fichier via `multipart/form-data` (champ `file`) et retourne une URL.
 *     tags: [NOTIFICATIONS]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Fichier à uploader
 *     responses:
 *       200:
 *         description: Upload réussi
 *       400:
 *         description: Fichier manquant
 *       500:
 *         description: Erreur serveur
 */
import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { saveUploadsFile } from '@/lib/storage';
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name}`;
        const url = await saveUploadsFile(
            `notifications/${filename}`,
            buffer,
            file.type || undefined
        );

        return NextResponse.json({
            success: true,
            url
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}