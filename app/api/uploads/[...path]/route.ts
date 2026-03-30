/**
 * @swagger
 * /api/uploads/{path}:
 *   get:
 *     summary: Servir un fichier uploadé
 *     description: Retourne un fichier stocké dans le dossier uploads (images, pdf, etc.).
 *     tags: [UPLOADS]
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Chemin du fichier (catch-all)
 *     responses:
 *       200:
 *         description: Fichier binaire
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Fichier non trouvé
 *       500:
 *         description: Erreur serveur
 */
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { readUploadsFile, mimeFromExtension } from '@/lib/storage';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ path: string[] }> } | { params: { path: string[] } }
) {
    const origin = req.headers.get('origin');
    try {
        // Gérer les params comme Promise ou objet direct (selon la version de Next.js)
        const params = 'then' in context.params
            ? await context.params
            : context.params;

        const filePath = params.path.join('/');
        if (filePath.includes('..')) {
            const response = NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const fileBuffer = await readUploadsFile(filePath);
        if (!fileBuffer) {
            const response = NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeFromExtension(ext);

        // Extraire le nom du fichier pour le Content-Disposition
        const fileName = path.basename(filePath);

        const response = new NextResponse(new Uint8Array(fileBuffer), {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${fileName}"`,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('Erreur lors du chargement du fichier:', error);
        const response = NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

