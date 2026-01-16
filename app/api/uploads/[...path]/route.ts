import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
    req: Request,
    context: { params: Promise<{ path: string[] }> } | { params: { path: string[] } }
) {
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

        console.log('Upload request - filePath:', filePath);
        console.log('Upload request - fullPath:', fullPath);
        console.log('Upload request - exists:', fs.existsSync(fullPath));

        // Vérifier que le fichier existe et est dans le dossier uploads (sécurité)
        if (!fullPath.startsWith(uploadsBase)) {
            console.error('Access denied - path outside uploads:', fullPath);
            return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
        }

        if (!fs.existsSync(fullPath)) {
            console.error('File not found:', fullPath);
            return NextResponse.json({ error: 'Fichier non trouvé', path: fullPath }, { status: 404 });
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
        };

        const contentType = mimeTypes[ext] || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error: any) {
        console.error('Erreur lors du chargement du fichier:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}

