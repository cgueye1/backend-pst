/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Récupérer tous les trajets
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Liste des trajets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   start_point:
 *                     type: string
 *                     example: "Point A"
 *                   end_point:
 *                     type: string
 *                     example: "École ABC"
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Créer un nouveau trajet
 *     tags: [Trips]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               driver_id:
 *                 type: integer
 *                 example: 3
 *               school_id:
 *                 type: integer
 *                 example: 2
 *               start_point:
 *                 type: string
 *                 example: "Point A"
 *               end_point:
 *                 type: string
 *                 example: "École ABC"
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-12-15T08:00:00Z"
 *               capacity_max:
 *                 type: integer
 *                 example: 20
 *               is_recurring:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Trajet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 driver_id:
 *                   type: integer
 *                   example: 3
 *                 school_id:
 *                   type: integer
 *                   example: 2
 *                 start_point:
 *                   type: string
 *                   example: "Point A"
 *                 end_point:
 *                   type: string
 *                   example: "École ABC"
 *                 departure_time:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-12-15T08:00:00Z"
 *                 capacity_max:
 *                   type: integer
 *                   example: 20
 *                 is_recurring:
 *                   type: boolean
 *                   example: false
 *       500:
 *         description: Erreur serveur
 */


import { NextResponse } from "next/server";
import { query } from "@/lib/db";


export async function GET() {
    const res = await query(`
        SELECT
            t.id,
            t.start_point,
            t.end_point,
            s.name AS school_name 
            FROM trips t 
            LEFT JOIN schools s ON s.id = t.school_id
        ORDER BY t.created_at DESC
    `);

    return NextResponse.json(res.rows);
}

export async function POST(req: Request) {
  const { driver_id, school_id, start_point, end_point, departure_time, capacity_max, is_recurring } = await req.json();

  const res = await query(
    `INSERT INTO trips (driver_id, school_id, start_point, end_point, departure_time, capacity_max, is_recurring) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING *`,
    [driver_id, school_id, start_point, end_point, departure_time, capacity_max, is_recurring || false]
  );

  return NextResponse.json(res.rows[0], { status: 201 });
}
