// ========================================
// API PARENT - MON COMPTE (Next.js)
// Fichier: app/api/parents/account/route.ts
// ========================================

import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/parents/account:
 *   get:
 *     summary: Récupérer les informations du compte
 *     description: Récupère les informations du compte du parent connecté.
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
 *   put:
 *     summary: Modifier les informations personnelles
 *     description: Met à jour les informations personnelles du parent (nom, email, téléphone, adresse, mot de passe).
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
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               current_password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe actuel (requis pour changer le mot de passe)
 *               new_password:
 *                 type: string
 *                 format: password
 *                 description: Nouveau mot de passe
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

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const result = await query(
            `
      SELECT 
        id,
        name,
        email,
        phone,
        address,
        role,
        status,
        photo_profil,
        created_at
      FROM users
      WHERE id = $1
      `,
            [user.id]
        );

        if (result.rows.length === 0) {
            const response = NextResponse.json(
                { success: false, error: 'Utilisateur introuvable' },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const response = NextResponse.json({
            success: true,
            data: result.rows[0]
        });
        return setCorsHeaders(response, origin);

    } catch (error) {
        console.error('Erreur récupération compte:', error);
        const response = NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

export async function PUT(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            const response = NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
            return setCorsHeaders(response, origin);
        }

        const body = await request.json();
        const { name, phone, address } = body;

        // Validation
        if (!name || name.trim() === '') {
            const response = NextResponse.json(
                { success: false, error: 'Le nom est requis' },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const result = await query(
            `
      UPDATE users
      SET 
        name = COALESCE($1, name),
        phone = COALESCE($2, phone),
        address = COALESCE($3, address)
      WHERE id = $4
      RETURNING id, name, email, phone, address, photo_profil
      `,
            [name, phone, address, user.id]
        );

        const response = NextResponse.json({
            success: true,
            message: 'Informations mises à jour',
            data: result.rows[0]
        });
        return setCorsHeaders(response, origin);

    } catch (error) {
        console.error('Erreur mise à jour compte:', error);
        const response = NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
        return setCorsHeaders(response, origin);
    }
}

