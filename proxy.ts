import { NextResponse } from 'next/server';

export function proxy(request: Request) {
    const response = NextResponse.next();

    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Si la requête est OPTIONS (CORS preflight)
    if (request.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: response.headers,
        });
    }

    return response;
}

export const config = {
    matcher: "/api/:path*", // appliquer uniquement aux routes API
};
