import { NextRequest, NextResponse } from "next/server";
import swaggerUi from "swagger-ui-dist";
import { setCorsHeaders, corsOptions } from '@/lib/cors';

const UI_PATH = swaggerUi.getAbsoluteFSPath();

export async function OPTIONS(req: NextRequest) {
    return corsOptions(req);
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get('origin');
    
    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <title>Swagger Transport API</title>
    <link rel="stylesheet" href="/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>

    <script src="/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          url: "/api/swagger.json", 
          dom_id: "#swagger-ui"
        });
      };
    </script>
  </body>
  </html>
  `;

    const response = new NextResponse(html, { headers: { "Content-Type": "text/html" } });
    return setCorsHeaders(response, origin);
}
