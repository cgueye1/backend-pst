/**
 * @swagger
 * /uploads/{path}:
 *   get:
 *     summary: Servir un fichier uploadé (alias de /api/uploads)
 *     description: Réutilise la logique de /api/uploads/{path} pour servir les fichiers. Permet d'accéder aux fichiers via /uploads/... au lieu de /api/uploads/...
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
 *       404:
 *         description: Fichier non trouvé
 */
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { setCorsHeaders, corsOptions } from '@/lib/cors';

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
        // Dans Docker, utiliser directement /app/uploads
        // En local, utiliser process.cwd() + uploads
        const isDocker = fs.existsSync('/app/uploads');
        const uploadsBase = isDocker ? '/app/uploads' : path.join(process.cwd(), 'uploads');
        const fullPath = path.join(uploadsBase, filePath);

        // Vérifier que le fichier existe et est dans le dossier uploads (sécurité)
        if (!fullPath.startsWith(uploadsBase)) {
            console.error('Access denied - path outside uploads:', fullPath);
            const response = NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        if (!fs.existsSync(fullPath)) {
            console.error('File not found:', fullPath);
            const response = NextResponse.json({ error: 'Fichier non trouvé', path: fullPath }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const fileBuffer = fs.readFileSync(fullPath);
        const ext = path.extname(fullPath).toLowerCase();

        // Déterminer le type MIME
        const mimeTypes: { [key: string]: string } = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.pdf': 'application/pdf',
            '.mp4': 'video/mp4',
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // Extraire le nom du fichier pour le Content-Disposition
        const fileName = path.basename(fullPath);

        const response = new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${fileName}"`, // inline pour les images (au lieu de attachment)
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('Erreur lors du chargement du fichier:', error);
        const errorResponse = NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
        return setCorsHeaders(errorResponse, origin);
    }
}

