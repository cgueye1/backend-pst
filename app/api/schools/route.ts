/**
 * @swagger
 * /api/schools:
 *   get:
 *     summary: Récupérer toutes les écoles
 *     description: Récupère la liste de toutes les écoles triées par nom.
 *     tags: ["ADMIN"]
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
 *   post:
 *     summary: Créer une nouvelle école
 *     description: Crée une nouvelle école avec logo et horaires. Utilise form-data pour l'upload du logo.
 *     tags: ["ADMIN"]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "École ABC"
 *               address:
 *                 type: string
 *                 example: "Dakar, Almadies"
 *               opening_time:
 *                 type: string
 *                 description: Heure d'ouverture (HH:MM)
 *                 example: "08:00"
 *                 default: 08:00
 *               closing_time:
 *                 type: string
 *                 description: Heure de fermeture (HH:MM)
 *                 example: "18:00"
 *                 default: 18:00
 *               schedule:
 *                 type: string
 *                 description: Horaires hebdomadaires en JSON
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Logo de l'école (fichier image)
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




import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import path from 'path';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { saveUploadsFile, schoolRowWithPublicLogoUrl } from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function GET(req: NextRequest) {
    const res = await query('SELECT * FROM schools ORDER BY name');
    const rows = await Promise.all(
        res.rows.map((r) => schoolRowWithPublicLogoUrl(r as Record<string, unknown>, req.headers))
    );
    const response = NextResponse.json(rows);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
}

export async function POST(req: NextRequest) {
    try {
        // Convert Next.js Request to FormData
        const formData = await req.formData();
        

        const name = formData.get('name') as string;
        const address = formData.get('address') as string;
        const opening_time = (formData.get('opening_time') as string) || '08:00';
        const closing_time = (formData.get('closing_time') as string) || '18:00';
        const scheduleJson = formData.get('schedule') as string;
        const logoFile = formData.get('logo') as File | null;

        console.log('Received form data:', { name, address, opening_time, closing_time, hasLogo: !!logoFile, hasSchedule: !!scheduleJson });


        let schedule = null;
        if (scheduleJson) {
            try {
                schedule = JSON.parse(scheduleJson);
            } catch (e) {
                console.error('Error parsing schedule JSON:', e);
            }
        }
        

        if (!schedule || !Array.isArray(schedule)) {
            schedule = [
                { day: 'Lundi', open: true, openTime: '08:00', closeTime: '18:00' },
                { day: 'Mardi', open: true, openTime: '08:00', closeTime: '18:00' },
                { day: 'Mercredi', open: true, openTime: '08:00', closeTime: '18:00' },
                { day: 'Jeudi', open: true, openTime: '08:00', closeTime: '18:00' },
                { day: 'Vendredi', open: true, openTime: '08:00', closeTime: '18:00' },
                { day: 'Samedi', open: false, openTime: '00:00', closeTime: '00:00' },
                { day: 'Dimanche', open: false, openTime: '00:00', closeTime: '00:00' }
            ];
        }

        // Validation
        if (!name || !address) {
            console.error('Validation failed: missing name or address');
            const errorResponse = NextResponse.json(
                { error: 'Le nom et l\'adresse sont requis' },
                { status: 400 }
            );
            errorResponse.headers.set('Access-Control-Allow-Origin', '*');
            return errorResponse;
        }

        // Gérer l'upload du logo
        let logo_url: string | null = null;
        if (logoFile && logoFile.size > 0) {
            const ext = path.extname(logoFile.name || '');
            const filename = `school_${Date.now()}${ext}`;
            const bytes = await logoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            logo_url = await saveUploadsFile(
                `schools/${filename}`,
                buffer,
                logoFile.type || undefined
            );
        }

          let res;
        try {
            res = await query(
                'INSERT INTO schools (name, address, opening_time, closing_time, logo_url, schedule) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [name, address, opening_time, closing_time, logo_url, JSON.stringify(schedule)]
            );
        } catch (scheduleError: any) {
            if (scheduleError.message && scheduleError.message.includes('column "schedule"')) {
                console.warn('Schedule column does not exist, inserting without schedule');
                res = await query(
                    'INSERT INTO schools (name, address, opening_time, closing_time, logo_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                    [name, address, opening_time, closing_time, logo_url]
                );
            } else {
                throw scheduleError;
            }
        }

        const row = await schoolRowWithPublicLogoUrl(
            res.rows[0] as Record<string, unknown>,
            req.headers
        );
        const response = NextResponse.json(row, { status: 201 });
        response.headers.set('Access-Control-Allow-Origin', '*');
        return response;
    } catch (error: any) {
        console.error('Erreur lors de la création de l\'école:', error);
        console.error('Stack trace:', error.stack);
        const errorResponse = NextResponse.json(
            { error: error.message || 'Erreur lors de la création de l\'école' },
            { status: 500 }
        );
        errorResponse.headers.set('Access-Control-Allow-Origin', '*');
        return errorResponse;
    }
}
