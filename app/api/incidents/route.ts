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
export async function GET(req: Request) {
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

        // Count query remains similar
        const countSql = `
            SELECT COUNT(*) as total
            FROM incidents
            WHERE type_de_problem ILIKE $1 OR description ILIKE $1
        `;
        const countResult = await query(countSql, [`%${search}%`]);
        const total = parseInt(countResult.rows[0].total, 10);

        return NextResponse.json({
            incidents: result.rows,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
        });
    } catch (error) {
        console.error('GET incidents error:', error);
        return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 });
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
    try {
        const user = await getUserFromRequest(req);
        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const formData = await req.formData();
        const type_de_problem = formData.get('type_de_problem') as string;
        const description = formData.get('description') as string;

        if (!type_de_problem || !description) {
            return NextResponse.json(
                { error: 'Champs obligatoires manquants' },
                { status: 400 }
            );
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
            return NextResponse.json(
                { error: 'Au moins un document est requis' },
                { status: 400 }
            );
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

        return NextResponse.json(res.rows[0], { status: 201 });

    } catch (error: any) {
        console.error('POST incident error:', error);
        return NextResponse.json(
            { error: error.message || 'Erreur lors de la création de l’incident' },
            { status: 500 }
        );
    }
}



