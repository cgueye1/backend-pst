/**
 * @swagger
 * /api/parents/payment:
 *   post:
 *     summary: Payer un trajet réservé
 *     description: >
 *       Initie un paiement PayTech pour un trajet réservé.
 *       Supporte mobile money et carte bancaire.
 *     tags: ["Parents"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - trip_id
 *               - payment_method
 *             properties:
 *               trip_id:
 *                 type: integer
 *                 description: ID du trajet à payer
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
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Trajet introuvable ou déjà payé
 *       500:
 *         description: Erreur serveur
 */

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import axios from "axios";
import { getUserFromRequest } from "@/lib/auth";
import { getPaymentMethodToStore } from "@/lib/payments/utils";

import { setCorsHeaders, corsOptions } from '@/lib/cors';
export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get('origin');
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== "parent") {
            const response = NextResponse.json({ success: false }, { status: 403 });
            return setCorsHeaders(response, origin);
        }

        const { 
            trip_id, 
            payment_method, 
            mobile_provider, 
            mobile_number,
            // Informations carte bancaire (si payment_method = 'card')
            card_holder_name,
            card_number,
            card_cvv,
            card_exp_month,
            card_exp_year
        } = await req.json();

        // Validation des données
        if (!trip_id || !payment_method) {
            const response = NextResponse.json({ success: false, message: "trip_id et payment_method requis" }, { status: 400 });
            return setCorsHeaders(response, origin);
        }

        // Validation selon la méthode de paiement
        if (payment_method === 'mobile_money') {
            if (!mobile_provider || !String(mobile_provider).trim()) {
                const response = NextResponse.json(
                    { success: false, message: "mobile_provider requis pour mobile_money (ex: WAVE, ORANGE_MONEY)" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
            if (!mobile_number || !String(mobile_number).trim()) {
                const response = NextResponse.json(
                    { success: false, message: "mobile_number requis pour mobile_money (ex: +221771234567)" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        } else if (payment_method === 'card') {
            // Validation des informations de carte bancaire
            if (!card_holder_name || !String(card_holder_name).trim()) {
                const response = NextResponse.json(
                    { success: false, message: "card_holder_name requis pour paiement par carte" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
            if (!card_number || !String(card_number).trim()) {
                const response = NextResponse.json(
                    { success: false, message: "card_number requis pour paiement par carte" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
            if (!card_cvv || !String(card_cvv).trim()) {
                const response = NextResponse.json(
                    { success: false, message: "card_cvv requis pour paiement par carte" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
            if (!card_exp_month || !card_exp_year) {
                const response = NextResponse.json(
                    { success: false, message: "card_exp_month et card_exp_year requis pour paiement par carte" },
                    { status: 400 }
                );
                return setCorsHeaders(response, origin);
            }
        }
        if (payment_method !== 'mobile_money' && payment_method !== 'card') {
            const response = NextResponse.json(
                { success: false, message: "payment_method invalide (mobile_money ou card)" },
                { status: 400 }
            );
            return setCorsHeaders(response, origin);
        }

        const tripRes = await query(
            `SELECT id, price FROM trips WHERE id = $1 AND paid = false`,
            [trip_id]
        );

        if (tripRes.rowCount === 0) {
            const response = NextResponse.json({ success: false, message: "Trajet introuvable ou déjà payé" });
            return setCorsHeaders(response, origin);
        }

        const trip = tripRes.rows[0];
        const transactionId = `TRIP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

        // Déterminer la méthode de paiement réelle à enregistrer
        const methodToStore = getPaymentMethodToStore(payment_method, mobile_provider);

        // Préparer les données de carte si nécessaire
        const card_last4 = payment_method === 'card' && card_number
            ? card_number.replace(/\s/g, '').slice(-4)
            : null;

        // Créer paiement avec toutes les informations
        const payment = await query(
            `
                INSERT INTO payments (
                    user_id, amount, status, method, payment_type,
                    payment_provider, transaction_id, mobile_number, trip_id,
                    card_holder_name, card_last4, card_exp_month, card_exp_year
                )
                VALUES ($1, $2, 'pending', $3, 'trip', $4, $5, $6, $7, $8, $9, $10, $11)
                    RETURNING id
            `,
            [
                user.id,
                trip.price,
                methodToStore,
                'PayTech',
                transactionId,
                mobile_number || null,
                trip_id,
                card_holder_name || null,
                card_last4,
                card_exp_month ? parseInt(card_exp_month) : null,
                card_exp_year ? parseInt(card_exp_year) : null
            ]
        );

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Configuration du Payload PayTech
        const payload: any = {
            item_name: "Paiement trajet scolaire",
            item_price: Number(trip.price),
            currency: "XOF",
            ref_command: transactionId,
            command_name: `Paiement Trajet ${user.name}`,
            env: process.env.PAYTECH_ENV || "test",
            ipn_url: `${baseUrl}/api/payments/webhook/paytech`,
            success_url: `${baseUrl}/payment-success?ref=${transactionId}`,
            cancel_url: `${baseUrl}/payment-cancel?ref=${transactionId}`,
        };

        // Forçage du moyen de paiement selon le choix de l'utilisateur
        if (payment_method === "mobile_money") {
            payload.payment_method = "mobile_money";
            payload.provider = mobile_provider.toUpperCase();
            payload.mobile_number = mobile_number;
        } else if (payment_method === "card") {
            payload.payment_method = "card";
            // Ajouter les informations de carte si PayTech les accepte
            if (card_holder_name) payload.card_holder_name = card_holder_name;
            if (card_number) payload.card_number = card_number.replace(/\s/g, '');
            if (card_cvv) payload.card_cvv = card_cvv;
            if (card_exp_month) payload.card_exp_month = card_exp_month;
            if (card_exp_year) payload.card_exp_year = card_exp_year;
        }

        // Vérifier la configuration PayTech
        if (!process.env.PAYTECH_API_KEY || !process.env.PAYTECH_API_SECRET) {
            const response = NextResponse.json(
                {
                    success: false,
                    message: "Configuration PayTech manquante sur le serveur (PAYTECH_API_KEY / PAYTECH_API_SECRET)"
                },
                { status: 500 }
            );
            return setCorsHeaders(response, origin);
        }

        const response = await axios.post(
            "https://paytech.sn/api/payment/request-payment",
            payload,
            {
                headers: {
                    "API_KEY": process.env.PAYTECH_API_KEY,
                    "API_SECRET": process.env.PAYTECH_API_SECRET
                }
            }
        );

        if (response.data.success === 1 || response.data.success === "1") {
        const successResponse = NextResponse.json({
            success: true,
            payment_url: response.data.redirect_url,
                transaction_id: transactionId,
                trip_id: trip_id,
                amount: trip.price,
                payment_method: payment_method,
                message: payment_method === 'mobile_money'
                    ? 'Paiement mobile money initialisé. Scannez le QR code pour finaliser.'
                    : 'Paiement par carte initialisé. Redirection vers le formulaire de paiement.'
        });
        return setCorsHeaders(successResponse, origin);
        } else {
            const errorResponse = NextResponse.json({
                success: false,
                message: response.data.message || 'Erreur lors de l\'initialisation du paiement',
                paytech_error: response.data
            }, { status: 400 });
            return setCorsHeaders(errorResponse, origin);
        }

    } catch (e: any) {
        const paytechData = e?.response?.data;
        const status = e?.response?.status;
        console.error("PayTech Error:", status, paytechData || e.message);

        const message =
            paytechData?.message ||
            paytechData?.error ||
            e?.message ||
            "Erreur serveur";

        const errorResponse = NextResponse.json(
            {
                success: false,
                message,
                ...(process.env.NODE_ENV === 'development'
                    ? { paytech_status: status, paytech_response: paytechData }
                    : {})
            },
            { status: 500 }
        );
        return setCorsHeaders(errorResponse, origin);
    }
}
