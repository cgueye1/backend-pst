/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Récupérer un chauffeur par son ID
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du chauffeur
 *     responses:
 *       200:
 *         description: Chauffeur trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Moussa Diop
 *                 phone:
 *                   type: string
 *                   example: 771234567
 *                 license_number:
 *                   type: string
 *                   example: SN12345
 *                 status:
 *                   type: string
 *                   example: Approuvé
 *       404:
 *         description: Chauffeur non trouvé
 *       500:
 *         description: Erreur serveur
 *
 *   put:
 *     summary: Mettre à jour un chauffeur
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du chauffeur
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
 *       200:
 *         description: Chauffeur mis à jour avec succès
 *       500:
 *         description: Erreur serveur
 *
 *   delete:
 *     summary: Supprimer un chauffeur
 *     tags: [Drivers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du chauffeur
 *     responses:
 *       200:
 *         description: Chauffeur supprimé avec succès
 *       500:
 *         description: Erreur serveur
 */

import { NextResponse } from "next/server";
import {getDriverById, updateDriver, deleteDriver, updateDriverStatus} from "@/services/driverServices";
import {authMiddleware} from "@/lib/auth";

export async function GET(req: Request, params: { id: string }) {
    const driver = await getDriverById(Number(params.id));
    return NextResponse.json(driver);
}

export async function PUT(req: Request, params: { id: string }) {
    const body = await req.json();
    const updated = await updateDriver(Number(params.id), body);
    return NextResponse.json(updated);
}

export async function DELETE(req: Request, params: { id: string }) {
    await deleteDriver(Number(params.id));
    return NextResponse.json({ success: true });
}

