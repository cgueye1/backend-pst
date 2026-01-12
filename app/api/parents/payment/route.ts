import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import axios from "axios";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getUserFromRequest(req);

        if (!user || user.role !== "parent") {
            return NextResponse.json({ success: false }, { status: 403 });
        }

        const { trip_id, payment_method, mobile_provider, mobile_number } = await req.json();

        if (!trip_id || !payment_method) {
            return NextResponse.json({ success: false, message: "Données manquantes" }, { status: 400 });
        }

        const tripRes = await query(
            `SELECT id, price FROM trips WHERE id = $1 AND paid = false`,
            [trip_id]
        );

        if (tripRes.rowCount === 0) {
            return NextResponse.json({ success: false, message: "Trajet introuvable ou déjà payé" });
        }

        const trip = tripRes.rows[0];
        const transactionId = `TRIP-${Date.now()}`;

        //  Créer paiement
        const payment = await query(
            `
            INSERT INTO payments (
                user_id, amount, status, method, payment_type,
                payment_provider, transaction_id, mobile_number, trip_id
            )
            VALUES ($1, $2, 'pending', $3, 'trip', $4, $5, $6, $7)
            RETURNING id
            `,
            [
                user.id,
                trip.price,
                payment_method,
                mobile_provider || 'CARD',
                transactionId,
                mobile_number || null,
                trip_id
            ]
        );

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

        //   PayTech
        const payload: any = {
            item_name: "Paiement trajet scolaire",
            item_price: trip.price,
            currency: "XOF",
            ref_command: transactionId,
            env: process.env.PAYTECH_ENV || "test",
            ipn_url: `${baseUrl}/api/payments/webhook/paytech`,
            success_url: `${baseUrl}/payment-success`,
            cancel_url: `${baseUrl}/payment-cancel`,
        };

        if (payment_method === "mobile_money") {
            payload.payment_method = "mobile_money";
            payload.provider = mobile_provider.toUpperCase();
            payload.mobile_number = mobile_number;
        } else {
            payload.payment_method = "card";
        }

        const response = await axios.post(
            "https://paytech.sn/api/payment/request-payment",
            payload,
            {
                headers: {
                    API_KEY: process.env.PAYTECH_API_KEY!,
                    API_SECRET: process.env.PAYTECH_API_SECRET!
                }
            }
        );

        return NextResponse.json({
            success: true,
            payment_url: response.data.redirect_url,
            transaction_id: transactionId
        });

    } catch (e: any) {
        console.error(e);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
