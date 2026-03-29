/**
 * @swagger
 * /api/schools/{schoolId}/children:
 *   get:
 *     summary: Récupérer la liste des enfants inscrits dans une école
 *     description: >
 *       Récupère tous les enfants inscrits dans une école spécifique.
 *       Cet endpoint est destiné aux chauffeurs pour qu'ils puissent voir
 *       les enfants disponibles lorsqu'ils sélectionnent une école dans leur trajet.
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: schoolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'école
 *         example: 1
 *     responses:
 *       200:
 *         description: Liste des enfants récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Marie Dupont"
 *                       address:
 *                         type: string
 *                         example: "Dakar, Almadies"
 *                       school_id:
 *                         type: integer
 *                         example: 1
 *                       school_name:
 *                         type: string
 *                         example: "École Primaire ABC"
 *                       parent_id:
 *                         type: integer
 *                         example: 5
 *                       parent_name:
 *                         type: string
 *                         example: "Jean Dupont"
 *                       parent_phone:
 *                         type: string
 *                         example: "+221771234567"
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-01-15T10:30:00Z"
 *                 count:
 *                   type: integer
 *                   description: Nombre total d'enfants
 *                   example: 25
 *       400:
 *         description: ID d'école invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID d'école invalide"
 *       403:
 *         description: Non autorisé - Token invalide ou utilisateur n'est pas un chauffeur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Non autorisé"
 *       404:
 *         description: École introuvable ou inactive
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "École introuvable ou inactive"
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Erreur lors de la récupération des enfants"
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

type Params = {
    params: Promise<{ id: string }>;
};

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest, context: Params) {
    const origin = request.headers.get('origin');
    try {
        // 1. Authentification et vérification du rôle
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "driver") {
            const response = NextResponse.json(
                { success: false, error: "Non autorisé" },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        // 2. Récupération de l'ID de l'école depuis les paramètres
        const { id } = await context.params;
        const schoolId = Number(id);

        if (isNaN(schoolId) || schoolId <= 0) {
            const response = NextResponse.json(
                { success: false, message: "ID d'école invalide" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // 3. Vérifier que l'école existe et est active
        const schoolCheck = await query(
            `SELECT id, name, status FROM schools WHERE id = $1`,
            [schoolId]
        );

        if (schoolCheck.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, message: "École introuvable" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const school = schoolCheck.rows[0];
        if (school.status && school.status !== 'Actif') {
            const response = NextResponse.json(
                { success: false, message: "École inactive" },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        // 4. Récupérer tous les enfants inscrits dans cette école avec les infos du parent
        const result = await query(
            `
            SELECT 
                c.id,
                c.name,
                c.address,
                c.school_id,
                c.created_at,
                c.schedule,
                
                s.name as school_name,
                s.address as school_address,
                
                u.id as parent_id,
                u.name as parent_name,
                u.phone as parent_phone,
                u.email as parent_email
                
            FROM children c
            INNER JOIN schools s ON c.school_id = s.id
            INNER JOIN users u ON c.parent_id = u.id
            WHERE c.school_id = $1
            ORDER BY c.name ASC
            `,
            [schoolId]
        );

        const response = NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length,
            school: {
                id: school.id,
                name: school.name
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur récupération enfants de l'école:", error);
        const errorResponse = NextResponse.json(
            {
                success: false,
                message: error.message || "Erreur lors de la récupération des enfants"
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}









