import { NextResponse } from "next/server";
import swaggerUi from "swagger-ui-dist";

const UI_PATH = swaggerUi.getAbsoluteFSPath();

export async function GET() {
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

    return new NextResponse(html, { headers: { "Content-Type": "text/html" } });
}
