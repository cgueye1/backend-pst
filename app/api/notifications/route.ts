import { query } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const sql = `
            SELECT n.*, u.name as emeteur_nom 
            FROM notifications n
            JOIN users u ON n.emeteur_id = u.id
            ORDER BY n.date_evenement DESC
        `;
        const result = await query(sql);
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: String(error)}, { status: 500 });
    }
}