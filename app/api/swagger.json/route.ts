// /api/swagger.json/route.ts
import { NextRequest, NextResponse } from "next/server";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    
    try {
        const cwd = process.cwd();

        const options = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "Transport API",
                    version: "1.0.0",
                    description: "API Admin / Parent / Chauffeur",
                },
                components: {
                    securitySchemes: {
                        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
                    },
                },
                security: [{ bearerAuth: [] }],
            },

            apis: [
                // 1. Les fichiers d'API contenant les annotations de route (GET, POST, etc.)
                path.resolve(cwd, "app/api/**/*.ts"),
                //  path.resolve(cwd, "app/api/auth/login/route.ts"),

                // 2. Les fichiers de définition de schémas (votre lib/swagger.ts)
                path.resolve(cwd, "lib/swagger.ts"),
            ],
        };

        const swaggerSpec = swaggerJSDoc(options);
        const response = NextResponse.json(swaggerSpec);
        return setCorsHeaders(response, origin);
    } catch (err) {
        console.error("Swagger generation error:", err);
        const response = NextResponse.json({ error: (err as Error).message }, { status: 500 });
        return setCorsHeaders(response, origin);
    }
}