import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import fs from "fs";
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mon API de Transport Next.js',
            version: '1.0.0',
        },
        // Le serveur de base de votre API
        servers: [{ url: '/api' }],
    },
    // Spécifie où sont stockés vos fichiers d'API avec les annotations JSDoc
    apis: [
        path.resolve(__dirname, 'app/api/**/*.ts'),
       // path.resolve(__dirname, 'app/api/drivers/route.ts'),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

// Écrire la spécification générée dans un fichier JSON
const outputPath = path.resolve(__dirname, 'swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(swaggerSpec, null, 2));

console.log(`Spécification Swagger/OpenAPI générée dans : ${outputPath}`);