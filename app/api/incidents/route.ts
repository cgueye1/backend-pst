import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET : Récupérer tous les incidents
export async function GET(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';

        const sql = `
            SELECT i.*, u.name as declarant 
            FROM incidents i
            LEFT JOIN users u ON i.user_id = u.id
            WHERE i.type_de_problem ILIKE $1 OR i.description ILIKE $1
            ORDER BY i.created_at DESC
        `;

        const result = await query(sql, [`%${search}%`]);
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error:  String(error) }, { status: 500 });
    }
}

// POST : Créer un incident (Modale Angular)
export async function POST(req:Request) {
    try {
        const body = await req.json();
        const { type_de_problem, description, documents, user_id } = body;

        const sql = `
            INSERT INTO incidents (type_de_problem, description, documents, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        // On transforme l'objet documents en chaîne JSON pour Postgres
        const result = await query(sql, [
            type_de_problem,
            description,
            JSON.stringify(documents || []),
            user_id
        ]);

        return NextResponse.json(result.rows[0], { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}