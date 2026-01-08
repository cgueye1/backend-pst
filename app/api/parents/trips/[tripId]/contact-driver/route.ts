import { NextRequest, NextResponse } from "next/server"; 
import { getUserFromRequest } from "@/lib/auth";
import {query} from "@/lib/db";

export async function POST(
    request: NextRequest,
    { params }: { params: { tripId: string } }
) {
    const user = await getUserFromRequest(request);
    if (!user) {
        return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    const { message } = await request.json();

    const driver = await query(
        `
    SELECT u.id FROM trips t
    INNER JOIN drivers d ON t.driver_id=d.id
    INNER JOIN users u ON d.user_id=u.id
    WHERE t.id=$1
    `,
        [params.tripId]
    );

    if (driver.rows.length === 0) {
        return NextResponse.json({ success: false, error: "Chauffeur introuvable" }, { status: 404 });
    }

    const conv = await query(
        `SELECT get_or_create_direct_conversation($1,$2) as conversation_id`,
        [user.user_id, driver.rows[0].id]
    );

    if (message) {
        await query(
            `INSERT INTO messages (conversation_id,sender_id,content) VALUES ($1,$2,$3)`,
            [conv.rows[0].conversation_id, user.user_id, message]
        );
    }

    return NextResponse.json({
        success: true,
        data: { conversation_id: conv.rows[0].conversation_id },
    });
}
