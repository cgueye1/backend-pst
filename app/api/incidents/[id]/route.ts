/**
 * @swagger
 * /api/incidents/{id}:
 *   get:
 *     summary: Récupérer un incident par ID
 *     description: Récupère les détails d'un incident spécifique.
 *     tags: ["SIGNALER UN PROBLEME"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID id
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
 *     summary: Mettre à jour un incident
 *     description: Met à jour un incident.
 *     tags: ["SIGNALER UN PROBLEME"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *             properties:
 *               type_de_problem:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: ["En cours","Resolu"]
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
 *     summary: Supprimer un incident
 *     description: Supprime un incident.
 *     tags: ["SIGNALER UN PROBLEME"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID id
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
 *     summary: Mettre à jour le statut d'un incident
 *     description: Change le statut d'un incident.
 *     tags: ["SIGNALER UN PROBLEME"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID id
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
 *                 enum: ["En cours","Resolu"]
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
import { NextRequest, NextResponse } from 'next/server';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
import { getUserFromRequest } from '@/lib/auth';

import path from "path";
import { saveUploadsFile } from "@/lib/storage";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

// GET: Récupérer un incident par ID
export async function GET(
    req: NextRequest,
    context: Params
) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const sql = 'SELECT * FROM incidents WHERE id = $1';
        const result = await query(sql, [numericId]);

        if (result.rows.length === 0) {
            const response = NextResponse.json({ error: 'Incident not found' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        // Parser les documents JSON
        const incident = result.rows[0];
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

        const response = NextResponse.json(incident);
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('GET incident by ID error:', error);
        const response = NextResponse.json({ error: 'Failed to fetch incident' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

// PUT: Mettre à jour un incident
export async function PUT(
    req: NextRequest,
    context: Params
) {
    const origin = req.headers.get('origin');
    try {
        // Vérifier l'authentification
        const user = await getUserFromRequest(req);
        if (!user) {
            const response = NextResponse.json({ error: 'Non autorise' }, { status: 401 });
            return setCorsHeaders(response, origin);
        }

        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const formData = await req.formData();
        const type_de_problem = formData.get('type_de_problem') as string;
        const description = formData.get('description') as string;

        // Récupérer l'user_id depuis l'incident existant pour préserver l'original
        const existingIncident = await query('SELECT user_id FROM incidents WHERE id = $1', [numericId]);
        if (existingIncident.rows.length === 0) {
            const response = NextResponse.json({ error: 'Incident not found' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }
        const user_id = existingIncident.rows[0].user_id;

        // Validation
        if (!type_de_problem || !description || isNaN(user_id)) {
            const response = NextResponse.json({
                error: 'Missing or invalid required fields'
            }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Récupérer les documents existants
        const existingIncidentData = await query('SELECT documents FROM incidents WHERE id = $1', [numericId]);
        let existingDocuments: any[] = [];
        if (existingIncidentData.rows[0]?.documents) {
            try {
                existingDocuments = typeof existingIncidentData.rows[0].documents === 'string'
                    ? JSON.parse(existingIncidentData.rows[0].documents)
                    : existingIncidentData.rows[0].documents;
            } catch (e) {
                console.error('Error parsing existing documents:', e);
                existingDocuments = [];
            }
        }
        // Récupérer les URLs des documents à garder (utiliser l'URL comme identifiant unique)
        // Si keep_documents est présent (même vide), on filtre selon les URLs
        // Si keep_documents n'est pas présent du tout, on garde tous les documents existants
        const documentsUrlsToKeep: string[] = [];
        let keepIndex = 0;
        let hasKeepDocuments = false;
        while (formData.has(`keep_documents[${keepIndex}]`)) {
            hasKeepDocuments = true;
            const docUrl = formData.get(`keep_documents[${keepIndex}]`) as string;
            if (docUrl) {
                documentsUrlsToKeep.push(docUrl);
            }
            keepIndex++;
        }

        console.log('Documents existants:', existingDocuments);
        console.log('URLs à garder:', documentsUrlsToKeep);
        console.log('hasKeepDocuments:', hasKeepDocuments);

        // Filtrer les documents existants à garder en utilisant l'URL comme identifiant
        let filteredExistingDocuments: any[] = [];
        if (hasKeepDocuments) {
            // Si keep_documents a été envoyé (même vide), filtrer selon les URLs
            filteredExistingDocuments = existingDocuments.filter((doc) => {
                const docUrl = doc.url || doc.path || '';
                // Comparaison flexible : normaliser les URLs (enlever les slashes en début si nécessaire)
                const normalizedDocUrl = docUrl.startsWith('/') ? docUrl : `/${docUrl}`;
                const normalizedKeepUrl = documentsUrlsToKeep.map(url => url.startsWith('/') ? url : `/${url}`);
                return normalizedKeepUrl.includes(normalizedDocUrl) || documentsUrlsToKeep.includes(docUrl);
            });
        } else {
            // Si keep_documents n'a pas été envoyé, garder tous les documents existants (compatibilité)
            filteredExistingDocuments = existingDocuments;
        }

        console.log('Documents filtrés à garder:', filteredExistingDocuments);

        // Traiter les nouveaux documents
        const newDocuments: any[] = [];
        let index = 0;
        while (formData.has(`documents[${index}]`)) {
            const file = formData.get(`documents[${index}]`) as File;
            if (file) {
                const ext = path.extname(file.name);
                const filename = `incident_${Date.now()}_${index}${ext}`;
                const bytes = await file.arrayBuffer();
                const url = await saveUploadsFile(
                    `incidents/${filename}`,
                    Buffer.from(bytes),
                    file.type || undefined
                );

                newDocuments.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url,
                });
            }
            index++;
        }

        // Fusionner les documents existants (filtrés) avec les nouveaux
        // Limiter à 3 documents maximum au total
        const allDocuments = [...filteredExistingDocuments, ...newDocuments].slice(0, 3);

        console.log('Nouveaux documents:', newDocuments);
        console.log('Tous les documents (fusionnés):', allDocuments);

        // Validation : au moins un document est requis
        if (allDocuments.length === 0) {
            console.error('Erreur: Aucun document après fusion');
            const response = NextResponse.json(
                { error: 'Au moins un document est requis. Veuillez conserver au moins un document existant ou ajouter un nouveau fichier.' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Update query
        const sql = `
            UPDATE incidents
            SET
                type_de_problem = $1,
                description = $2,
                documents = $3,
                user_id = $4,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $5
                RETURNING *
        `;

        const result = await query(sql, [
            type_de_problem,
            description,
            allDocuments.length > 0 ? JSON.stringify(allDocuments) : null,
            user_id,
            numericId
        ]);

        if (result.rows.length === 0) {
            const response = NextResponse.json({ error: 'Incident not found' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        // Parser les documents JSON dans la réponse
        const incident = result.rows[0];
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

        const response = NextResponse.json(incident);
        return setCorsHeaders(response, origin);
    } catch (error: any) {
        console.error('PUT incident error:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        const response = NextResponse.json(
            {
                error: error.message || 'Failed to update incident',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

// DELETE: Supprimer un incident
export async function DELETE(
    req: NextRequest,
    context: Params
) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Optionnel: Vérifier que l'utilisateur a le droit de supprimer
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('user_id');

        if (!user_id) {
            const response = NextResponse.json({
                error: 'user_id is required'
            }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const sql = 'DELETE FROM incidents WHERE id = $1 RETURNING *';
        const result = await query(sql, [numericId]);

        if (result.rows.length === 0) {
            const response = NextResponse.json({ error: 'Incident not found' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }

        const response = NextResponse.json({
            message: 'Incident deleted successfully',
            incident: result.rows[0]
        });
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('DELETE incident error:', error);
        const response = NextResponse.json({ error: 'Failed to delete incident' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}

// PATCH: Mettre à jour le statut uniquement
export async function PATCH(
    req: NextRequest,
    context: Params
) {
    const origin = req.headers.get('origin');
    try {
        const { id } = await context.params;
        const numericId = parseInt(id, 10);

        if (isNaN(numericId)) {
            const response = NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const { status } = body;

        if (!status || !['En cours', 'Resolu'].includes(status)) {
            const response = NextResponse.json({
                error: 'Invalid status. Must be "En cours" or "Resolu"'
            }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        const sql = `
            UPDATE incidents
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
                RETURNING *
        `;

        // Récupérer l'incident existant pour vérifier le changement de statut
        const existingIncident = await query('SELECT * FROM incidents WHERE id = $1', [numericId]);
        if (existingIncident.rows.length === 0) {
            const response = NextResponse.json({ error: 'Incident not found' }, { status: 404 });
            return setCorsHeaders(response, origin);
        }
        const oldStatus = existingIncident.rows[0].status;

        const result = await query(sql, [status, numericId]);

        // Notifier les admins si l'incident est résolu
        if (status === 'Resolu' && oldStatus !== 'Resolu') {
            try {
                const { notifyAdmins, AdminNotificationTypes } = await import('@/services/notificationService');
                const incident = result.rows[0];
                await notifyAdmins(
                    'Incident résolu',
                    AdminNotificationTypes.INCIDENT_RESOLVED,
                    `L'incident "${incident.type_de_problem}" (ID: ${numericId}) a été marqué comme résolu.`,
                    undefined
                );
            } catch (notifError) {
                console.error('Erreur notification admin:', notifError);
            }
        }

        const response = NextResponse.json(result.rows[0]);
        return setCorsHeaders(response, origin);
    } catch (error) {
        console.error('PATCH incident error:', error);
        const response = NextResponse.json({ error: 'Failed to update incident status' }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}