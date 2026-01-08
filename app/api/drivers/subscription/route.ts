// app/api/drivers/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import axios from "axios";
import { getUserFromRequest } from "@/lib/auth";
/**
 * @swagger
 * /api/drivers/subscription:
 *   post:
 *     summary: Souscription a un abonnement suivie de paiement et de recu electronique
 *     tags: [CHAUFFEUR]
 */

export async function POST(request: NextRequest) {
    try {
        // 1. Authentification et vérification du rôle
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "driver") {
            return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
        }

        const body = await request.json();
        const { plan_id, payment_method, mobile_provider, mobile_number } = body;

        // 2. Validation des données
        if (!plan_id || !payment_method) {
            return NextResponse.json({ success: false, message: "Plan ou méthode de paiement manquante" }, { status: 400 });
        }

        // 3. Récupération du plan d'abonnement
        const planRes = await query(`SELECT * FROM subscription_plans WHERE id = $1`, [plan_id]);
        if (planRes.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Plan introuvable" }, { status: 404 });
        }
        const plan = planRes.rows[0];

        const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // 4. Enregistrement du paiement en base (Statut: pending)
        const paymentInsert = await query(
            `INSERT INTO payments (user_id, amount, status, method, payment_type, transaction_id, payment_provider, mobile_number) 
             VALUES ($1, $2, 'pending', $3, 'subscription', $4, $5, $6) RETURNING id`,
            [user.id, plan.price, payment_method, transactionId, mobile_provider || 'CARD', mobile_number || null]
        );
        const paymentId = paymentInsert.rows[0].id;

        // 5. Création de la souscription (active: false)
        await query(
            `INSERT INTO subscriptions (user_id, plan_id, type, price, start_date, end_date, active, payment_id) 
             VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_DATE + ($5::integer * INTERVAL '1 day'), false, $6)`,
            [user.id, plan_id, plan.name, plan.price, plan.duration_days, paymentId]
        );

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // 6. Configuration du Payload PayTech pour éviter la page de sélection
        const paytechPayload: any = {
            item_name: `Abonnement ${plan.name}`,
            item_price: Number(plan.price),
            currency: "XOF",
            ref_command: transactionId,
            command_name: `Paiement Chauffeur ${user.name}`,
            env: process.env.PAYTECH_ENV || "test",
            ipn_url: `${baseUrl}/api/payments/webhook/paytech`,
            success_url: `${baseUrl}/payment-success?ref=${transactionId}`,
            cancel_url: `${baseUrl}/payment-cancel?ref=${transactionId}`,
        };

        // Forçage du moyen de paiement selon ton design
        if (payment_method === 'mobile_money') {
            paytechPayload.payment_method = 'mobile_money';
            paytechPayload.provider = mobile_provider.toUpperCase(); // 'WAVE', 'ORANGE_MONEY', etc.
            paytechPayload.mobile_number = mobile_number;
        } else {
            paytechPayload.payment_method = 'card';
        }

        // 7. Appel à PayTech
        const response = await axios.post(
            "https://paytech.sn/api/payment/request-payment",
            paytechPayload,
            {
                headers: {
                    "API_KEY": process.env.PAYTECH_API_KEY,
                    "API_SECRET": process.env.PAYTECH_API_SECRET
                }
            }
        );

        if (response.data.success === 1 || response.data.success === "1") {
            return NextResponse.json({
                success: true,
                payment_url: response.data.redirect_url, // URL vers le QR Code ou Formulaire Carte
                transaction_id: transactionId
            });
        } else {
            return NextResponse.json({ success: false, message: response.data.message }, { status: 400 });
        }

    } catch (error: any) {
        console.error("PayTech Error:", error.response?.data || error.message);
        return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
    }
}