/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Récupérer une école par son ID
 *     description: Récupère les informations détaillées d'une école spécifique.
 *     tags: ["ADMIN"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école
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
 *   put:
 *     summary: Mettre à jour une école
 *     description: Met à jour les informations d'une école (nom, adresse, horaires, logo). Utilise form-data.
 *     tags: ["ADMIN"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école
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
 *                 example: "08:00"
 *               closing_time:
 *                 type: string
 *                 example: "18:00"
 *               schedule:
 *                 type: string
 *                 description: Horaires en JSON
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Nouveau logo (fichier image)
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
 *   patch:
 *     summary: Mettre à jour le statut d'une école
 *     description: Change le statut d'une école (Actif/Inactif).
 *     tags: ["ADMIN"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: ["Actif","Inactif"]
 *                 example: "Actif"
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
 *     summary: Supprimer une école
 *     description: Supprime une école et son logo associé.
 *     tags: ["ADMIN"]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école
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
import {
    saveUploadsFile,
    deleteUploadsByStoredUrl,
    schoolRowWithPublicLogoUrl,
} from '@/lib/storage';

// Configure runtime for file uploads
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Upload + DB : éviter timeout proxy / client (Vercel défaut 10s ; ajustable selon hébergeur). */
export const maxDuration = 120;

function isClientDisconnectError(err: unknown): boolean {
    const e = err as { code?: string; message?: string; name?: string };
    if (e?.code === 'ECONNRESET') return true;
    if (e?.name === 'AbortError') return true;
    const m = String(e?.message ?? '').toLowerCase();
    return m.includes('aborted') || m.includes('econnreset');
}

type Params = {
    params: Promise<{ id: string }>;
};

// CORS Helper
function setCorsHeaders(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}

export async function OPTIONS() {
    return setCorsHeaders(new NextResponse(null, { status: 204 }));
}

export async function GET(req: NextRequest, context: Params) {
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        const res = await query('SELECT * FROM schools WHERE id=$1', [numericId]);

        if (res.rowCount === 0) {
            return setCorsHeaders(
                NextResponse.json({ error: 'École non trouvée' }, { status: 404 })
            );
        }

        return setCorsHeaders(
            NextResponse.json(
                schoolRowWithPublicLogoUrl(res.rows[0] as Record<string, unknown>, req.headers)
            )
        );
    } catch (error: any) {
        console.error('GET school error:', error);
        return setCorsHeaders(
            NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
        );
    }
}

export async function PUT(req: NextRequest, context: Params) {
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        const formData = await req.formData();
        const name = formData.get('name') as string;
        const address = formData.get('address') as string;
        const opening_time = (formData.get('opening_time') as string) || '08:00';
        const closing_time = (formData.get('closing_time') as string) || '18:00';
        const scheduleJson = formData.get('schedule') as string;
        const logoFile = formData.get('logo') as File | null;

        console.log('Update school data:', {
            id: numericId,
            name,
            address,
            opening_time,
            closing_time,
            hasLogo: !!logoFile,
            hasSchedule: !!scheduleJson
        });

        // Parse schedule
        let schedule = null;
        if (scheduleJson) {
            try {
                schedule = JSON.parse(scheduleJson);
            } catch (e) {
                console.error('Error parsing schedule JSON:', e);
            }
        }

        // Validation
        if (!name || !address) {
            return setCorsHeaders(
                NextResponse.json(
                    { error: 'Le nom et l\'adresse sont requis' },
                    { status: 400 }
                )
            );
        }

        // Gérer l'upload du logo
        let logo_url: string | null = null;
        if (logoFile && logoFile.size > 0) {
            const ext = path.extname(logoFile.name || '');
            const filename = `school_${numericId}_${Date.now()}${ext}`;
            const bytes = await logoFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            logo_url = await saveUploadsFile(
                `schools/${filename}`,
                buffer,
                logoFile.type || undefined
            );
            console.log('Logo uploaded:', logo_url);
        }

        // Construire la requête SQL dynamiquement
        const updates: string[] = [];
        const queryParams: any[] = [];
        let paramIndex = 1;

        // Champs de base
        updates.push(`name=$${paramIndex++}`);
        queryParams.push(name);

        updates.push(`address=$${paramIndex++}`);
        queryParams.push(address);

        updates.push(`opening_time=$${paramIndex++}`);
        queryParams.push(opening_time);

        updates.push(`closing_time=$${paramIndex++}`);
        queryParams.push(closing_time);

        // Logo (si fourni)
        if (logo_url) {
            updates.push(`logo_url=$${paramIndex++}`);
            queryParams.push(logo_url);
        }

        // Schedule (si fourni)
        if (schedule && Array.isArray(schedule)) {
            updates.push(`schedule=$${paramIndex++}`);
            queryParams.push(JSON.stringify(schedule));
        }

        // ID (toujours en dernier)
        queryParams.push(numericId);

        const queryText = `
            UPDATE schools 
            SET ${updates.join(', ')} 
            WHERE id=$${paramIndex}
            RETURNING *
        `;

        console.log('SQL Query:', queryText);
        console.log(
            'Params (aperçu):',
            queryParams.map((p) =>
                typeof p === 'string' && p.length > 160 ? `${p.slice(0, 80)}… (${p.length} car.)` : p
            )
        );

        let res;
        try {
            res = await query(queryText, queryParams);
        } catch (dbError: any) {
            // Fallback si la colonne schedule n'existe pas
            if (dbError.message?.includes('column "schedule"')) {
                console.warn('⚠️ Colonne schedule inexistante, mise à jour sans schedule');

                const fallbackUpdates = updates.filter(u => !u.includes('schedule'));
                const fallbackParams = queryParams.slice(0, -1); // Retire le schedule
                fallbackParams.push(numericId); // Re-ajoute l'ID

                const fallbackQuery = `
                    UPDATE schools 
                    SET ${fallbackUpdates.join(', ')} 
                    WHERE id=$${fallbackParams.length}
                    RETURNING *
                `;

                res = await query(fallbackQuery, fallbackParams);
            } else {
                throw dbError;
            }
        }

        if (res.rowCount === 0) {
            return setCorsHeaders(
                NextResponse.json({ error: 'École non trouvée' }, { status: 404 })
            );
        }

        return setCorsHeaders(
            NextResponse.json(
                schoolRowWithPublicLogoUrl(res.rows[0] as Record<string, unknown>, req.headers)
            )
        );

    } catch (error: any) {
        if (isClientDisconnectError(error)) {
            console.warn(
                'PUT school: connexion interrompue (aborted / ECONNRESET). La base peut déjà être à jour — vérifier côté client (timeout, navigation avant fin de requête, proxy).'
            );
        } else {
            console.error('PUT school error:', error);
            console.error('Stack:', error.stack);
        }

        try {
            const status = isClientDisconnectError(error) ? 408 : 500;
            const body = isClientDisconnectError(error)
                ? {
                      error: 'Requête interrompue ou timeout (client / proxy). Les données ont pu être enregistrées.',
                      code: 'CLIENT_ABORT',
                  }
                : { error: error.message || 'Erreur lors de la mise à jour' };
            return setCorsHeaders(NextResponse.json(body, { status }));
        } catch {
            return new NextResponse(null, { status: 408 });
        }
    }
}

export async function PATCH(req: NextRequest, context: Params) {
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        const body = await req.json();
        const { status } = body;

        // Validation
        if (!status || !['Actif', 'Inactif'].includes(status)) {
            return setCorsHeaders(
                NextResponse.json(
                    { error: 'Le statut doit être "Actif" ou "Inactif"' },
                    { status: 400 }
                )
            );
        }

        const res = await query(
            'UPDATE schools SET status=$1 WHERE id=$2 RETURNING *',
            [status, numericId]
        );

        if (res.rowCount === 0) {
            return setCorsHeaders(
                NextResponse.json({ error: 'École non trouvée' }, { status: 404 })
            );
        }

        return setCorsHeaders(
            NextResponse.json(
                schoolRowWithPublicLogoUrl(res.rows[0] as Record<string, unknown>, req.headers)
            )
        );

    } catch (error: any) {
        console.error('PATCH school status error:', error);

        // Fallback si la colonne status n'existe pas
        if (error.message?.includes('column "status"')) {
            console.warn('⚠️ Colonne status inexistante, mise à jour ignorée');
            const { id } = await context.params;
            return setCorsHeaders(
                NextResponse.json({
                    message: 'Colonne status inexistante. Mise à jour ignorée.',
                    id: Number(id)
                })
            );
        }

        return setCorsHeaders(
            NextResponse.json(
                { error: error.message || 'Erreur lors de la mise à jour du statut' },
                { status: 500 }
            )
        );
    }
}

export async function DELETE(req: NextRequest, context: Params) {
    try {
        const { id } = await context.params;
        const numericId = Number(id);

        const res = await query(
            'DELETE FROM schools WHERE id=$1 RETURNING *',
            [numericId]
        );

        if (res.rowCount === 0) {
            return setCorsHeaders(
                NextResponse.json({ error: 'École non trouvée' }, { status: 404 })
            );
        }

        // Supprimer le logo si existe
        const deletedSchool = res.rows[0];
        if (deletedSchool.logo_url) {
            await deleteUploadsByStoredUrl(deletedSchool.logo_url);
            console.log('Logo supprimé (stockage):', deletedSchool.logo_url);
        }

        return setCorsHeaders(
            NextResponse.json({
                success: true,
                message: 'École supprimée avec succès'
            })
        );

    } catch (error: any) {
        console.error('DELETE school error:', error);

        return setCorsHeaders(
            NextResponse.json(
                { error: error.message || 'Erreur lors de la suppression' },
                { status: 500 }
            )
        );
    }
}