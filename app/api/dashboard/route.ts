/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistiques et KPIs pour l'administration
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Récupérer les statistiques du tableau de bord
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Données du dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   description: Nombre d'utilisateurs par rôle
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                       total:
 *                         type: integer
 *                 parents:
 *                   type: integer
 *                   description: Nombre de parents
 *                 children:
 *                   type: integer
 *                   description: Nombre d'enfants
 *                 drivers:
 *                   type: integer
 *                   description: Nombre de chauffeurs
 *                 trips:
 *                   type: array
 *                   description: Statistiques des trajets par statut
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                       total:
 *                         type: integer
 *                 revenue_monthly:
 *                   type: array
 *                   description: Revenus mensuels (paiements payés)
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         format: date
 *                       total:
 *                         type: number
 *                 subscriptions_active:
 *                   type: integer
 *                   description: Nombre d'abonnements actifs
 *                 avg_subscription:
 *                   type: number
 *                   description: Montant moyen par abonnement
 *                 growth:
 *                   type: object
 *                   description: Taux de croissance des revenus du mois courant vs le mois précédent
 *                   properties:
 *                     this_month:
 *                       type: number
 *                     last_month:
 *                       type: number
 *                     growth_rate:
 *                       type: number
 *                 incidents:
 *                   type: array
 *                   description: Alertes incidents récentes
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       user_id:
 *                         type: integer
 *                       type:
 *                         type: string
 *                       message:
 *                         type: string
 *                       read:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 */

import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
    try {
        //  Nombre de parents
        const parentsRes = await query(`
            SELECT COUNT(*)::int AS total
            FROM users
            WHERE role = 'parent'
        `);

        //  Nombre de chauffeurs
        const driversRes = await query(`
            SELECT COUNT(*)::int AS total
            FROM users
            WHERE role = 'driver'
        `);

        //  Nombre d’enfants
        const childrenRes = await query(`
            SELECT COUNT(*)::int AS total
            FROM children
        `);
        //  Nombre de parents et enfants
        const parentCount = await query(`SELECT COUNT(*) AS total FROM users WHERE role='parent'`);
        const childrenCount = await query(`SELECT COUNT(*) AS total FROM children`);

        // Nombre de chauffeurs
        const driverCount = await query(`SELECT COUNT(*) AS total FROM users WHERE role='driver'`);

        //  Statistiques des trajets
        const tripStats = await query(
            `SELECT status, COUNT(*) AS total FROM trips GROUP BY status`);

        // Revenus mensuels
        const revenueMonthly = await query(`
            SELECT
                date_trunc('month', created_at) AS month,
  SUM(amount)::numeric(10,2) AS total
            FROM payments
            WHERE status = 'paid'
            GROUP BY 1
            ORDER BY 1 ASC;


        `);

        // Trajets du jour (total)
        const tripsToday = await query(`
            SELECT COUNT(*) AS total
            FROM trips
            WHERE DATE(created_at) = CURRENT_DATE
        `);

      // Trajets terminés aujourd’hui
        const tripsCompletedToday = await query(`
            SELECT COUNT(*) AS total
            FROM trips
            WHERE status = 'completed'
              AND DATE(created_at) = CURRENT_DATE
        `);

       // Trajets annulés aujourd’hui
        const tripsCanceledToday = await query(`
            SELECT COUNT(*) AS total
            FROM trips
            WHERE status = 'canceled'
              AND DATE(created_at) = CURRENT_DATE
        `);

        // Abonnements actifs
        const activeSubscriptions = await query(`
            SELECT COUNT(*)::int AS total
            FROM subscriptions
            WHERE active = true
              AND start_date <= CURRENT_DATE
              AND (end_date IS NULL OR end_date >= CURRENT_DATE)
        `);

        // Montant moyen par abonnement
        const avgSubscription = await query(
            `SELECT AVG(amount) AS avg_amount FROM payments WHERE status='paid'`);
       // Nombre d'écoles partenaires
        const schoolsCount = await query(
            `SELECT COUNT(*) AS total FROM schools WHERE status = 'Actif'`
        );


        // Croissance des abonnements par mois
        const subscriptionsGrowth = await query(`
            SELECT
                date_trunc('month', created_at) AS month,
    COUNT(*)::int AS total
            FROM subscriptions
            WHERE active = true
            GROUP BY 1
            ORDER BY 1 ASC
        `);

        //  Croissance : comparaison mois courant vs mois précédent
        const growthRate = await query(`
            WITH this_month AS (
                SELECT COALESCE(SUM(amount), 0) AS total
                FROM payments
                WHERE status='paid'
                  AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE)
            ),
                 last_month AS (
                     SELECT COALESCE(SUM(amount), 0) AS total
                     FROM payments
                     WHERE status='paid'
                       AND date_trunc('month', created_at) = date_trunc('month', CURRENT_DATE - INTERVAL '1 month')
                 )
            SELECT
                this_month.total AS this_month,
                last_month.total AS last_month,
                CASE
                    WHEN last_month.total = 0 THEN 0
                    ELSE ((this_month.total - last_month.total) / last_month.total) * 100
                    END AS growth_rate
            FROM this_month, last_month
        `);


        //   Alertes incidents
        const incidentAlerts = await query(`SELECT * FROM notifications WHERE type='incident' ORDER BY created_at DESC LIMIT 10`);

        return NextResponse.json({
            success: true,
            users: {
                parents: parentsRes.rows[0].total,
                chauffeurs: driversRes.rows[0].total,
                enfants: childrenRes.rows[0].total,
            },
            parents: parseInt(parentCount.rows[0].total),
            children: parseInt(childrenCount.rows[0].total),
            drivers: parseInt(driverCount.rows[0].total),
            trips_today: parseInt(tripsToday.rows[0].total),
            trips_completed_today: parseInt(tripsCompletedToday.rows[0].total),
            trips_canceled_today: parseInt(tripsCanceledToday.rows[0].total),
            trips: tripStats.rows,
            schools: parseInt(schoolsCount.rows[0].total),
            revenue_monthly: revenueMonthly.rows,
            subscriptions_active: activeSubscriptions.rows[0].total,
            subscriptions_growth: subscriptionsGrowth.rows,
            avg_subscription: avgSubscription.rows[0].avg_amount,
            growth: growthRate.rows[0],
            incidents: incidentAlerts.rows
        });

    } catch (error: unknown) {
        console.error("Dashboard Error:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
