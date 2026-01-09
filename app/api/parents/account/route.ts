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

/**
 * @swagger
 * /api/parents/account:
 *   get:
 *     summary: Récupérer les informations du compte
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   put:
 *     summary: Modifier les informations personnelles
 *     tags: [Parents]
 */

export async function GET(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
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
            return NextResponse.json(
                { success: false, error: 'Utilisateur introuvable' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur récupération compte:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const user = await getUserFromRequest(request);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 403 }
            );
        }

        const body = await request.json();
        const { name, phone, address } = body;

        // Validation
        if (!name || name.trim() === '') {
            return NextResponse.json(
                { success: false, error: 'Le nom est requis' },
                { status: 400 }
            );
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

        return NextResponse.json({
            success: true,
            message: 'Informations mises à jour',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Erreur mise à jour compte:', error);
        return NextResponse.json(
            { success: false, error: 'Erreur serveur' },
            { status: 500 }
        );
    }
}

