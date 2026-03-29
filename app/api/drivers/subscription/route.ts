// app/api/drivers/subscription/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import axios from "axios";
import { getUserFromRequest } from "@/lib/auth";
import { getPaymentMethodToStore } from "@/lib/payments/utils";
import { setCorsHeaders, corsOptions } from '@/lib/cors';
/**
 * @swagger
 * /api/drivers/subscription:
 *   get:
 *     summary: Récupérer l'abonnement actuel du chauffeur
 *     description: Retourne l'abonnement actif du chauffeur avec les détails du plan.
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Abonnement trouvé
 *       404:
 *         description: Aucun abonnement actif
 *       403:
 *         description: Non autorisé
 *   post:
 *     summary: Souscription à un abonnement suivie de paiement
 *     description: >
 *       Crée une souscription (inactive) et initie immédiatement un paiement PayTech.
 *       L'abonnement sera activé automatiquement après confirmation du paiement via webhook.
 *     tags: [CHAUFFEUR]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - plan_id
 *               - payment_method
 *             properties:
 *               plan_id:
 *                 type: integer
 *                 description: ID du plan d'abonnement
 *                 example: 1
 *               payment_method:
 *                 type: string
 *                 description: Méthode de paiement
 *                 enum: [mobile_money, card]
 *                 example: mobile_money
 *               mobile_provider:
 *                 type: string
 *                 description: Requis si payment_method = mobile_money (Wave, Orange Money, etc.)
 *                 example: WAVE
 *               mobile_number:
 *                 type: string
 *                 description: Numéro mobile requis si payment_method = mobile_money
 *                 example: "+221771234567"
 *               card_holder_name:
 *                 type: string
 *                 description: Nom sur la carte (requis si payment_method = card)
 *                 example: "Lamine Wade"
 *               card_number:
 *                 type: string
 *                 description: Numéro de carte (requis si payment_method = card)
 *                 example: "1234567890123456"
 *               card_cvv:
 *                 type: string
 *                 description: Code CVV (requis si payment_method = card)
 *                 example: "123"
 *               card_exp_month:
 *                 type: string
 *                 description: Mois d'expiration MM (requis si payment_method = card)
 *                 example: "12"
 *               card_exp_year:
 *                 type: string
 *                 description: Année d'expiration YYYY (requis si payment_method = card)
 *                 example: "2025"
 *     responses:
 *       200:
 *         description: Paiement initialisé (URL PayTech)
 *       400:
 *         description: Données invalides
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Plan introuvable
 *       500:
 *         description: Erreur serveur
 */

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "driver") {
            const response = NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const subscriptionRes = await query(
            `SELECT s.*, sp.name as plan_name, sp.description as plan_description, sp.duration_days, sp.features
             FROM subscriptions s
             LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
             WHERE s.user_id = $1 AND s.active = true
             ORDER BY s.end_date DESC LIMIT 1`,
            [user.id]
        );

        if (subscriptionRes.rowCount === 0) {
            const response = NextResponse.json(
                { success: false, message: "Aucun abonnement actif trouvé", has_subscription: false },
                { status: 404 }
            );
            return setCorsHeaders(response, origin);
        }

        const subscription = subscriptionRes.rows[0];
        const endDate = new Date(subscription.end_date);
        const today = new Date();
        const daysRemaining = Math.max(0, Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

        const response = NextResponse.json({
            success: true,
            data: {
                ...subscription,
                days_remaining: daysRemaining,
                is_expiring_soon: daysRemaining <= 7 && daysRemaining > 0,
                is_expired: daysRemaining === 0
            }
        });
        return setCorsHeaders(response, origin);

    } catch (error: any) {
        console.error("Erreur GET subscription:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message || "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}

export async function POST(request: NextRequest) {
    const origin = request.headers.get('origin');
    try {
        const user = await getUserFromRequest(request);
        if (!user || user.role !== "driver") {
            const response = NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const body = await request.json();
        const {
            plan_id,
            payment_method,
            mobile_provider,
            mobile_number,
            card_holder_name,
            card_number,
            card_cvv,
            card_exp_month,
            card_exp_year
        } = body;

        if (!plan_id || !payment_method) {
            const response = NextResponse.json({ success: false, message: "plan_id et payment_method requis" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Validation selon la méthode de paiement
        if (payment_method === 'mobile_money') {
            if (!mobile_provider || !mobile_number) {
                const response = NextResponse.json(
                    { success: false, message: "mobile_provider et mobile_number requis pour mobile_money" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        } else if (payment_method === 'card') {
            if (!card_holder_name || !card_number || !card_cvv || !card_exp_month || !card_exp_year) {
                const response = NextResponse.json(
                    { success: false, message: "Informations de carte incomplètes" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        } else {
            const response = NextResponse.json(
                { success: false, message: "payment_method invalide (mobile_money ou card)" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        // Récupération du plan
        const planRes = await query(`SELECT * FROM subscription_plans WHERE id = $1 AND role = 'driver' AND active = true`, [plan_id]);
        if (planRes.rowCount === 0) {
            const response = NextResponse.json({ success: false, message: "Plan introuvable" }, { status: 404 });
            return setCorsHeaders(response, origin);
        }
        const plan = planRes.rows[0];

        const transactionId = `TRX-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const methodToStore = getPaymentMethodToStore(payment_method, mobile_provider);
        const card_last4 = payment_method === 'card' && card_number ? card_number.replace(/\s/g, '').slice(-4) : null;

        await query('BEGIN');
        try {
            // Créer le paiement (pending)
            const paymentResult = await query(
                `INSERT INTO payments (
                    user_id, amount, status, method, payment_type, transaction_id, 
                    payment_provider, mobile_number, card_holder_name, card_last4, 
                    card_exp_month, card_exp_year
                )
                 VALUES ($1, $2, 'pending', $3, 'subscription', $4, $5, $6, $7, $8, $9, $10) 
                 RETURNING id`,
                [
                    user.id, plan.price, methodToStore, transactionId, 'PayTech',
                    mobile_number || null, card_holder_name || null, card_last4,
                    card_exp_month ? parseInt(card_exp_month) : null,
                    card_exp_year ? parseInt(card_exp_year) : null
                ]
            );
            const paymentId = paymentResult.rows[0].id;

            // Créer l'abonnement (inactif)
            await query(
                `INSERT INTO subscriptions (user_id, plan_id, type, price, start_date, end_date, active, payment_id)
                 VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_DATE + ($5::integer * INTERVAL '1 day'), false, $6)`,
                [user.id, plan_id, plan.name, plan.price, plan.duration_days, paymentId]
            );

            // Simulation PayTech - marquer comme payé et activer
            await query(`UPDATE payments SET status = 'paid' WHERE id = $1`, [paymentId]);
            await query(`UPDATE subscriptions SET active = true WHERE payment_id = $1`, [paymentId]);

            await query('COMMIT');

            const response = NextResponse.json({
                success: true,
                message: "Abonnement créé avec succès (simulation)",
                transaction_id: transactionId,
                plan: {
                    id: plan.id,
                    name: plan.name,
                    price: plan.price,
                    duration_days: plan.duration_days
                },
                payment_method: payment_method
            });
            return setCorsHeaders(response, origin);

        } catch (error) {
            await query('ROLLBACK');
            throw error;
        }

    } catch (error: any) {
        console.error("Erreur POST subscription:", error);
        const errorResponse = NextResponse.json(
            { success: false, message: error.message || "Erreur serveur" },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}