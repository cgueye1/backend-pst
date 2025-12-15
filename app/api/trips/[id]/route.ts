/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Récupérer un trajet par son ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du trajet
 *     responses:
 *       200:
 *         description: Trajet trouvé
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
 *                 status:
 *                   type: string
 *                   example: "pending"
 *                 is_recurring:
 *                   type: boolean
 *                   example: false
 *       404:
 *         description: Trajet non trouvé
 *       500:
 *         description: Erreur serveur
 *
 *   put:
 *     summary: Mettre à jour un trajet
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du trajet
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
 *               status:
 *                 type: string
 *                 example: "pending"
 *               is_recurring:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Trajet mis à jour avec succès
 *       500:
 *         description: Erreur serveur
 *
 *   patch:
 *     summary: Affecter un chauffeur à un trajet (si non déjà affecté)
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du trajet
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
 *     responses:
 *       200:
 *         description: Chauffeur affecté avec succès
 *       400:
 *         description: Paramètres invalides (trip_id ou driver_id manquants)
 *       409:
 *         description: Trajet introuvable ou déjà affecté
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprimer un trajet
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du trajet
 *     responses:
 *       200:
 *         description: Trajet supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       500:
 *         description: Erreur serveur
 */


import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request, params: { id: string }) {
    const id = Number(params.id);
    const res = await query('SELECT * FROM trips WHERE id=$1', [id]);
    if (res.rowCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(res.rows[0]);
}

export async function PUT(req: Request, params: { id: string }) {
    const id = Number(params.id);
    const { driver_id, school_id, start_point, end_point, departure_time, capacity_max, status, is_recurring } = await req.json();

    const res = await query(
        `UPDATE trips 
         SET driver_id=$1, school_id=$2, start_point=$3, end_point=$4, departure_time=$5, capacity_max=$6, status=$7, is_recurring=$8 
         WHERE id=$9 
         RETURNING *`,
        [driver_id, school_id, start_point, end_point, departure_time, capacity_max, status, is_recurring, id]
    );

    return NextResponse.json(res.rows[0]);
}

// Route PATCH pour affecter un chauffeur à un trajet



export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // ✅ OBLIGATOIRE AVEC APP ROUTER
        const { id } = await context.params;
        const tripId = Number(id);

        const body = await req.json();
        const { driver_id } = body;

        if (!tripId || !driver_id) {
            return NextResponse.json(
                { message: "trip_id et driver_id requis" },
                { status: 400 }
            );
        }

        const result = await query(
            `
                UPDATE trips
                SET driver_id = $1
                WHERE id = $2 AND driver_id IS NULL
                    RETURNING *
            `,
            [driver_id, tripId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { message: "Trajet introuvable ou déjà affecté" },
                { status: 409 }
            );
        }

        return NextResponse.json(result.rows[0]);
    } catch (error) {
        console.error("❌ Erreur affectation chauffeur :", error);
        return NextResponse.json(
            { message: "Erreur serveur" },
            { status: 500 }
        );
    }
}


export async function DELETE(req: Request, params: { id: string }) {
    const id = Number(params.id);
    await query('DELETE FROM trips WHERE id=$1', [id]);
    return NextResponse.json({ success: true });
}
