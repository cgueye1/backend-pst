/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Récupérer tous les chauffeurs
 *     tags: [Drivers]
 *     responses:
 *       200:
 *         description: Liste des chauffeurs
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
 *                   name:
 *                     type: string
 *                     example: Moussa Diop
 *                   phone:
 *                     type: string
 *                     example: 771234567
 *                   license_number:
 *                     type: string
 *                     example: SN12345
 *       500:
 *         description: Erreur serveur
 *
 *   post:
 *     summary: Créer un nouveau chauffeur
 *     tags: [Drivers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Moussa Diop
 *               phone:
 *                 type: string
 *                 example: 771234567
 *               license_number:
 *                 type: string
 *                 example: SN12345
 *     responses:
 *       201:
 *         description: Chauffeur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 name:
 *                   type: string
 *                   example: Moussa Diop
 *                 phone:
 *                   type: string
 *                   example: 771234567
 *                 license_number:
 *                   type: string
 *                   example: SN12345
 *       500:
 *         description: Erreur serveur
 */
import { NextResponse } from "next/server";
import { getAllDrivers, createDriver } from "@/services/driverServices";

export async function GET() {
    try {
        const drivers = await getAllDrivers();
        return NextResponse.json(drivers);
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const driver = await createDriver(data);
        return NextResponse.json(driver, { status: 201 });
    } catch (err) {
        return NextResponse.json({ error: String(err) }, { status: 500 });
    }
}
