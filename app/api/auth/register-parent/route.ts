/**
 * @swagger
 * /api/auth/register-parent:
 *   post:
 *     summary: Inscription d'un parent
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               phone:
 *                 type: string
 *                 example: "+221770000000"
 *               password:
 *                 type: string
 *                 example: "secret123"
 *     responses:
 *       200:
 *         description: Parent créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                   example: parent
 *       500:
 *         description: Erreur serveur
 */

import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { query } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const { name, email, phone, password } = await req.json();

        // hash du mot de passe
        const hashedPassword = await hashPassword(password);

        const res = await query(
            `INSERT INTO users (name,email,phone,password,role) VALUES ($1,$2,$3,$4,'parent') RETURNING id,name,email,phone,role`,
            [name, email, phone, hashedPassword]
        );

        return NextResponse.json(res.rows[0]);
    } catch (err: unknown) {
        const error = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error }, { status: 500 });
    }
}
