/**
 * @swagger
 * /api/parents/children:
 *   get:
 *     summary: Récupérer tous les enfants du parent
 *     description: Retourne la liste de tous les enfants avec leurs horaires personnalisés.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Ajouter un ou plusieurs enfants
 *     description: Ajoute un ou plusieurs enfants au compte du parent.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - school_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Marie Dupont"
 *               address:
 *                 type: string
 *                 example: "Dakar, Almadies"
 *               school_id:
 *                 type: integer
 *                 description: ID de l'école
 *                 example: 1
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

import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";




import { setCorsHeaders, corsOptions } from '@/lib/cors';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        const body = await req.json();
        const children = Array.isArray(body) ? body : [body];

        if (children.length === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Aucun enfant fourni' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const createdChildren = [];

        for (const child of children) {
            const { name, address, school_id } = child;

            //   Validation
            if (!name || !address || !school_id) {
                const response = NextResponse.json(
                    {
                        success: false,
                        error: 'Les champs name, address et school_id sont obligatoires'
                    },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            //  Vérifier que l'école existe
            const schoolCheck = await query(
                `SELECT id FROM schools WHERE id = $1 AND status = 'Actif'`,
                [school_id]
            );

            if (schoolCheck.rowCount === 0) {
                const response = NextResponse.json(
                    {
                        success: false,
                        error: `École invalide ou inactive (school_id=${school_id})`
                    },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }

            //   Insertion enfant
            const result = await query(
                `
                    INSERT INTO children (parent_id, name, address, school_id)
                    VALUES ($1, $2, $3, $4)
                        RETURNING *
                `,
                [user.id, name, address, school_id]
            );

            createdChildren.push(result.rows[0]);
        }

        const response = NextResponse.json(
            {
                success: true,
                message: `${createdChildren.length} enfant(s) ajouté(s) avec succès`,
                data: createdChildren.length === 1 ? createdChildren[0] : createdChildren
            },
            { status: 201 }
        );
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur ajout enfants:', error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur',
                details: error.message
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

// GET - Récupérer les enfants du parent
export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupérer tous les enfants du parent avec leurs infos complètes
        const result = await query(
            `
            SELECT 
                c.id,
                c.parent_id,
                c.name,
                c.school_id,
                c.address,
                c.created_at,
                c.schedule,
                
                s.name as school_name,
                s.address as school_address,
                s.opening_time,
                s.closing_time,
                s.schedule as school_schedule
                
            FROM children c
            LEFT JOIN schools s ON c.school_id = s.id
            WHERE c.parent_id = $1
            ORDER BY c.created_at DESC
            `,
            [user.id]
        );

        const response = NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error('❌ Erreur récupération enfants:', error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur',
                details: error.message
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

