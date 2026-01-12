/**
 * @swagger
 * /api/parents/children:
 *   get:
 *     summary: Récupérer tous les enfants du parent
 *     description: Retourne la liste de tous les enfants avec leurs horaires personnalisés
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Ajouter un ou plusieurs enfants
 *     tags: [Parents]
 *     security:
 *       - bearerAuth: []

 */



import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";




export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);
        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const children = Array.isArray(body) ? body : [body];

        if (children.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Aucun enfant fourni' },
                { status: 400 }
            );
        }

        const createdChildren = [];

        for (const child of children) {
            const { name, address, school_id } = child;

            //   Validation
            if (!name || !address || !school_id) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Les champs name, address et school_id sont obligatoires'
                    },
                    { status: 400 }
                );
            }

            //  Vérifier que l’école existe
            const schoolCheck = await query(
                `SELECT id FROM schools WHERE id = $1 AND status = 'Actif'`,
                [school_id]
            );

            if (schoolCheck.rowCount === 0) {
                return NextResponse.json(
                    {
                        success: false,
                        error: `École invalide ou inactive (school_id=${school_id})`
                    },
                    { status: 400 }
                );
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

        return NextResponse.json(
            {
                success: true,
                message: `${createdChildren.length} enfant(s) ajouté(s) avec succès`,
                data: createdChildren.length === 1 ? createdChildren[0] : createdChildren
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('❌ Erreur ajout enfants:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur',
                details: error.message
            },
            { status: 500 }
        );
    }
}

// GET - Récupérer les enfants du parent
export async function GET(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== 'parent') {
            return NextResponse.json(
                { success: false, error: 'Non autorisé' },
                { status: 401 }
            );
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
                
                s.name as school_name,
                s.address as school_address,
                s.opening_time,
                s.closing_time,
                
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', cs.id,
                            'day', cs.day_of_week,
                            'arrival_time', cs.arrival_time::text,
                            'departure_time', cs.departure_time::text
                        ) ORDER BY 
                            CASE cs.day_of_week
                                WHEN 'monday' THEN 1
                                WHEN 'tuesday' THEN 2
                                WHEN 'wednesday' THEN 3
                                WHEN 'thursday' THEN 4
                                WHEN 'friday' THEN 5
                                WHEN 'saturday' THEN 6
                                WHEN 'sunday' THEN 7
                            END
                    ) FILTER (WHERE cs.id IS NOT NULL),
                    '[]'::json
                ) as schedules
                
            FROM children c
            LEFT JOIN schools s ON c.school_id = s.id
            LEFT JOIN child_schedules cs ON c.id = cs.child_id
            WHERE c.parent_id = $1
            GROUP BY c.id, s.id
            ORDER BY c.created_at DESC
            `,
            [user.id]
        );

        return NextResponse.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });

    } catch (error: any) {
        console.error('❌ Erreur récupération enfants:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Erreur serveur',
                details: error.message
            },
            { status: 500 }
        );
    }
}

