/**
 * @swagger
 * /api/incidents:
 *   get:
 *     summary: Récupérer la liste des incidents
 *     description: Récupère les incidents avec recherche, pagination et tri par date.
 *     tags: ["SIGNALER UN PROBLEME"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Recherche dans le type ou la description
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: ["En cours","Resolu"]
 *         description: status
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: page
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *         description: limit
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
 *     summary: Créer un incident
 *     description: Crée un incident avec 1 à 3 documents obligatoires.
 *     tags: ["SIGNALER UN PROBLEME"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               type_de_problem:
 *                 type: string
 *                 example: "Accident"
 *               description:
 *                 type: string
 *                 example: "Description détaillée du problème"
 *               documents:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Documents (1 à 3 fichiers)
 *                 minItems: 1
 *                 maxItems: 3
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




import { query } from '@/lib/db';
import {NextRequest, NextResponse} from 'next/server';
import {getUserFromRequest} from "@/lib/auth";

import path from 'path';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { saveUploadsFile } from '@/lib/storage';
interface Incident {
    id: number;
    type_de_problem: string;
    description: string;
    status: 'En cours' | 'Resolu';
    documents: any[];
    user_id: number; // Ensure this matches the table
    created_at: string;
    updated_at: string;
    declarant?: string;
}

// GET: Retrieve incidents with search and pagination
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const offset = (page - 1) * limit;

        // Fixed SQL: Added WHERE for search, LIMIT, and OFFSET
        const sql = `
            SELECT *
            FROM incidents
            WHERE type_de_problem ILIKE $1 OR description ILIKE $1
            ORDER BY created_at DESC
                LIMIT $2 OFFSET $3
        `;
        const values = [`%${search}%`, limit, offset];
        const result = await query(sql, values);

        // Parser les documents JSON pour chaque incident
        const incidents = result.rows.map((incident: any) => {
            if (incident.documents) {
                try {
                    incident.documents = typeof incident.documents === 'string' 
                        ? JSON.parse(incident.documents) 
                        : incident.documents;
                } catch (e) {
                    console.error('Error parsing documents:', e);
                    incident.documents = [];
                }
            } else {
                incident.documents = [];
            }
            return incident;
        });

        // Count query remains similar
        const countSql = `
            SELECT COUNT(*) as total
            FROM incidents
            WHERE type_de_problem ILIKE $1 OR description ILIKE $1
        `;
        const countResult = await query(countSql, [`%${search}%`]);
        const total = parseInt(countResult.rows[0].total, 10);

        const response = NextResponse.json({
            incidents: incidents,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('GET incidents error:', error);
        const response = NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}





export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            const response = NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const formData = await req.formData();
        const type_de_problem = formData.get('type_de_problem') as string;
        const description = formData.get('description') as string;

        if (!type_de_problem || !description) {
            const response = NextResponse.json(
                { error: 'Champs obligatoires manquants' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // 📁 Gestion des documents (1 à 3 max)
        const documents: any[] = [];
        for (let i = 0; i < 3; i++) {
            const file = formData.get(`documents[${i}]`);
            if (file && file instanceof File) {
                const ext = path.extname(file.name);
                const filename = `incident_${Date.now()}_${i}${ext}`;
                const bytes = await file.arrayBuffer();
                const url = await saveUploadsFile(
                    `incidents/${filename}`,
                    Buffer.from(bytes),
                    file.type || undefined
                );

                documents.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url,
                });
            }
        }

        if (documents.length === 0) {
            const response = NextResponse.json(
                { error: 'Au moins un document est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const res = await query(
            `INSERT INTO incidents (
                type_de_problem,
                description,
                documents,
                user_id,
                status
            ) VALUES ($1, $2, $3, $4, 'En cours') RETURNING *`,
            [type_de_problem, description, JSON.stringify(documents), user.id]
        );

        // Notifier les admins du nouvel incident
        try {
            const { notifyAdmins, AdminNotificationTypes } = await import('@/services/notificationService');
            const notificationType = type_de_problem.toLowerCase().includes('urgent') || 
                                   type_de_problem.toLowerCase().includes('critique')
                ? AdminNotificationTypes.CRITICAL_INCIDENT
                : AdminNotificationTypes.NEW_INCIDENT;
            
            await notifyAdmins(
                notificationType === AdminNotificationTypes.CRITICAL_INCIDENT 
                    ? '⚠️ Incident critique signalé'
                    : 'Nouvel incident signalé',
                notificationType,
                `Un incident a été signalé par ${user.name || user.email}.\nType : ${type_de_problem}\nDescription : ${description.substring(0, 200)}${description.length > 200 ? '...' : ''}`,
                user.id
            );
        } catch (notifError) {
            console.error('Erreur notification admin:', notifError);
            // Ne pas faire échouer la création de l'incident
        }

        const response = NextResponse.json(res.rows[0], { status: 201 });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('POST incident error:', error);
        const response = NextResponse.json(
            { error: error.message || 'Erreur lors de la création de l incident' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}



