import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { sendSms } from "@/lib/sms";

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
                `SELECT id, user_id, amount, mobile_number, status
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

            //  Activer l’abonnement
            await query(
                `UPDATE subscriptions
                 SET active = true, start_date = NOW()
                 WHERE payment_id = $1`,
                [payment.id]
            );

            //   Générer numéro de reçu
            const receiptNumber = `REC-${Date.now()}`;

            // Construire le SMS
            const smsMessage = `
  Paiement confirmé

Reçu : ${receiptNumber}
Montant : ${payment.amount} CFA
Service : Abonnement Chauffeur
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
