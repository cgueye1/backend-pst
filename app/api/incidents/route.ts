/**
 * @swagger
 * /api/incidents:
 *   get:
 *     summary: Récupérer la liste des incidents
 *     description: >
 *       Retourne les incidents avec recherche, pagination et tri par date de création.
 *     tags: [ADMIN]

 */
/**
 * @swagger
 * /api/incidents:
 *   post:
 *     summary: Créer un nouvel incident
 *     description: >
 *       Permet de créer un incident avec 1 à 3 documents obligatoires. pour tous les utilisateurs
 *     tags:
 *       - SIGNALER UN PROBLEME

 */

import { query } from '@/lib/db';
import {NextRequest, NextResponse} from 'next/server';
import {getUserFromRequest} from "@/lib/auth";

import fs from 'fs';
import path from 'path';
import { setCorsHeaders, corsOptions } from '@/lib/cors';
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

// Dossier pour les uploads d'incidents
const uploadDir = path.join(process.cwd(), '/uploads/incidents');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

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
                const filePath = path.join(uploadDir, filename);

                // Convertir File en Buffer et sauvegarder
                const bytes = await file.arrayBuffer();
                fs.writeFileSync(filePath, Buffer.from(bytes));

                documents.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    url: `/uploads/incidents/${filename}`, // chemin accessible via API
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



