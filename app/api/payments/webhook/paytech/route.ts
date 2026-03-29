/**
 * @swagger
 * /api/payments/webhook/paytech:
 *   post:
 *     summary: Webhook PayTech
 *     description: Endpoint appelé par PayTech pour notifier l'état des paiements (pas d'auth Bearer).
 *     tags: [PAYMENTS]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ref_command:
 *                 type: string
 *               payment_status:
 *                 type: string
 *                 example: success
 *               type_event:
 *                 type: string
 *                 example: sale_complete
 *     responses:
 *       200:
 *         description: Accusé de réception
 */
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendSms } from "@/lib/sms";

import { setCorsHeaders, corsOptions } from '@/lib/cors';

// Force dynamic rendering pour éviter les erreurs de build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log("=== WEBHOOK PAYTECH ===");
        console.log(JSON.stringify(body, null, 2));

        const {
            ref_command,
            payment_status,
            type_event
        } = body;

        //   Paiement confirmé
        if (payment_status === "success" && type_event === "sale_complete") {

            //  Récupérer le paiement (avec sécurité idempotente)
            const paymentRes = await query(
                `SELECT id, user_id, amount, mobile_number, status, payment_type, trip_id
                 FROM payments
                 WHERE transaction_id = $1`,
                [ref_command]
            );

            if (paymentRes.rowCount === 0) {
                console.warn("Transaction introuvable:", ref_command);
                return NextResponse.json({ success: true });
            }

            const payment = paymentRes.rows[0];

            //   Déjà traité → stop
            if (payment.status === "completed") {
                console.log("Paiement déjà confirmé, SMS non renvoyé");
                return NextResponse.json({ success: true });
            }

            //  Marquer paiement comme complété
            await query(
                `UPDATE payments
                 SET status = 'completed', updated_at = NOW()
                 WHERE id = $1`,
                [payment.id]
            );

            let serviceName = "";
            let smsMessage = "";

            // Traiter selon le type de paiement
            if (payment.payment_type === 'subscription') {
                //  Activer l'abonnement
                await query(
                    `UPDATE subscriptions
                     SET active = true, start_date = NOW()
                     WHERE payment_id = $1`,
                    [payment.id]
                );
                serviceName = "Abonnement Chauffeur";
            } else if (payment.payment_type === 'trip' && payment.trip_id) {
                // Marquer le trajet comme payé
                await query(
                    `UPDATE trips
                     SET paid = true, updated_at = NOW()
                     WHERE id = $1`,
                    [payment.trip_id]
                );
                serviceName = "Trajet Scolaire";
            }

            //   Générer numéro de reçu
            const receiptNumber = `REC-${Date.now()}`;

            // Construire le SMS
            smsMessage = `
Paiement confirmé

Reçu : ${receiptNumber}
Montant : ${payment.amount} CFA
Service : ${serviceName}
Réf : ${ref_command}

Merci pour votre confiance.
            `.trim();

            //   Envoyer le SMS
            if (payment.mobile_number) {
                await sendSms(payment.mobile_number, smsMessage);
                console.log("📩 Reçu SMS envoyé à", payment.mobile_number);
            } else {
                console.warn("⚠️ Aucun numéro de téléphone pour le paiement", payment.id);
            }
        }

        // Paiement annulé
        if (payment_status === "cancelled") {
            await query(
                `UPDATE payments
                 SET status = 'cancelled', updated_at = NOW()
                 WHERE transaction_id = $1`,
                [ref_command]
            );
            console.log("Paiement annulé:", ref_command);
        }

        //   Toujours répondre 200 à PayTech
        return NextResponse.json({ success: true });

    } catch (err: any) {
        console.error(" Erreur webhook PayTech:", err);

        //   Toujours 200 pour éviter retry infini
        return NextResponse.json({ success: false }, { status: 200 });
    }
}
