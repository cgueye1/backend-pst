const fs = require('fs');
const path = require('path');

// Routes restantes à améliorer avec leurs configurations complètes
const routeConfigs = {
  // Trips
  'app/api/trips/route.ts': {
    GET: {
      summary: 'Récupérer tous les trajets',
      description: 'Récupère la liste de tous les trajets avec filtres optionnels.',
      tags: ['ADMIN'],
      security: true,
      queryParams: {
        status: { type: 'string', required: false, enum: ['pending', 'completed', 'canceled'] },
        driver_id: { type: 'integer', required: false },
        school_id: { type: 'integer', required: false },
        date_from: { type: 'string', format: 'date-time', required: false },
        date_to: { type: 'string', format: 'date-time', required: false },
        page: { type: 'integer', required: false, default: 1 },
        limit: { type: 'integer', required: false, default: 20 }
      }
    },
    POST: {
      summary: 'Créer un trajet',
      description: 'Crée un nouveau trajet. Réservé aux administrateurs.',
      tags: ['ADMIN'],
      security: true,
      body: {
        driver_id: { type: 'integer', required: true },
        school_id: { type: 'integer', required: false },
        start_point: { type: 'string', required: true },
        end_point: { type: 'string', required: true },
        departure_time: { type: 'string', format: 'date-time', required: true },
        capacity_max: { type: 'integer', required: true },
        is_recurring: { type: 'boolean', required: false, default: false }
      }
    }
  },
  'app/api/trips/[id]/route.ts': {
    GET: {
      summary: 'Récupérer un trajet par ID',
      description: 'Récupère les détails d\'un trajet spécifique.',
      tags: ['ADMIN'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID du trajet' }
      }
    },
    PUT: {
      summary: 'Mettre à jour un trajet',
      description: 'Met à jour les informations d\'un trajet.',
      tags: ['ADMIN'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      },
      body: {
        start_point: { type: 'string', required: false },
        end_point: { type: 'string', required: false },
        departure_time: { type: 'string', format: 'date-time', required: false },
        capacity_max: { type: 'integer', required: false },
        status: { type: 'string', required: false, enum: ['pending', 'completed', 'canceled'] }
      }
    },
    DELETE: {
      summary: 'Supprimer un trajet',
      description: 'Supprime un trajet.',
      tags: ['ADMIN'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      }
    }
  },
  // Notifications
  'app/api/notifications/route.ts': {
    GET: {
      summary: 'Récupérer les notifications',
      description: 'Récupère les notifications de l\'utilisateur connecté.',
      tags: ['Notifications'],
      security: true,
      queryParams: {
        unread_only: { type: 'boolean', required: false, description: 'Filtrer uniquement les non lues' },
        limit: { type: 'integer', required: false, default: 20 },
        offset: { type: 'integer', required: false, default: 0 }
      }
    },
    POST: {
      summary: 'Créer une notification',
      description: 'Crée une nouvelle notification. Réservé aux administrateurs.',
      tags: ['Notifications'],
      security: true,
      body: {
        libelle: { type: 'string', required: true, example: 'Nouvelle notification' },
        description: { type: 'string', required: false },
        type: { type: 'string', required: false, enum: ['info', 'warning', 'error', 'success'] },
        destinataire_ids: { type: 'array', items: { type: 'integer' }, required: false, description: 'IDs des destinataires (vide = tous)' },
        image_url: { type: 'string', required: false }
      }
    }
  },
  'app/api/notifications/[id]/route.ts': {
    GET: {
      summary: 'Récupérer une notification par ID',
      description: 'Récupère les détails d\'une notification spécifique.',
      tags: ['Notifications'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      }
    },
    PUT: {
      summary: 'Mettre à jour une notification',
      description: 'Met à jour une notification.',
      tags: ['Notifications'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      },
      body: {
        libelle: { type: 'string', required: false },
        description: { type: 'string', required: false },
        statut: { type: 'string', required: false, enum: ['active', 'inactive'] }
      }
    },
    DELETE: {
      summary: 'Supprimer une notification',
      description: 'Supprime une notification.',
      tags: ['Notifications'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      }
    }
  },
  'app/api/notifications/[id]/read/route.ts': {
    PUT: {
      summary: 'Marquer une notification comme lue',
      description: 'Marque une notification comme lue pour l\'utilisateur connecté.',
      tags: ['Notifications'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de la notification' }
      }
    }
  },
  'app/api/notifications/user/route.ts': {
    GET: {
      summary: 'Récupérer les notifications de l\'utilisateur',
      description: 'Récupère toutes les notifications de l\'utilisateur connecté.',
      tags: ['Notifications'],
      security: true,
      queryParams: {
        unread_only: { type: 'boolean', required: false },
        limit: { type: 'integer', required: false, default: 50 }
      }
    }
  },
  // Incidents
  'app/api/incidents/route.ts': {
    GET: {
      summary: 'Récupérer la liste des incidents',
      description: 'Récupère les incidents avec recherche, pagination et tri par date.',
      tags: ['SIGNALER UN PROBLEME'],
      security: true,
      queryParams: {
        search: { type: 'string', required: false, description: 'Recherche dans le type ou la description' },
        status: { type: 'string', required: false, enum: ['En cours', 'Resolu'] },
        page: { type: 'integer', required: false, default: 1 },
        limit: { type: 'integer', required: false, default: 20 }
      }
    },
    POST: {
      summary: 'Créer un incident',
      description: 'Crée un incident avec 1 à 3 documents obligatoires.',
      tags: ['SIGNALER UN PROBLEME'],
      security: true,
      body: {
        type_de_problem: { type: 'string', required: true, example: 'Accident' },
        description: { type: 'string', required: true, example: 'Description détaillée du problème' },
        documents: { type: 'array', items: { type: 'string', format: 'binary' }, required: true, minItems: 1, maxItems: 3, description: 'Documents (1 à 3 fichiers)' }
      },
      contentType: 'multipart/form-data'
    }
  },
  'app/api/incidents/[id]/route.ts': {
    GET: {
      summary: 'Récupérer un incident par ID',
      description: 'Récupère les détails d\'un incident spécifique.',
      tags: ['SIGNALER UN PROBLEME'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      }
    },
    PUT: {
      summary: 'Mettre à jour un incident',
      description: 'Met à jour un incident.',
      tags: ['SIGNALER UN PROBLEME'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      },
      body: {
        type_de_problem: { type: 'string', required: false },
        description: { type: 'string', required: false },
        status: { type: 'string', required: false, enum: ['En cours', 'Resolu'] }
      }
    },
    DELETE: {
      summary: 'Supprimer un incident',
      description: 'Supprime un incident.',
      tags: ['SIGNALER UN PROBLEME'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      }
    },
    PATCH: {
      summary: 'Mettre à jour le statut d\'un incident',
      description: 'Change le statut d\'un incident.',
      tags: ['SIGNALER UN PROBLEME'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true }
      },
      body: {
        status: { type: 'string', required: true, enum: ['En cours', 'Resolu'] }
      }
    }
  }
};

function generateSwaggerDoc(filePath, methods) {
  const routePath = filePath
    .replace('app/api/', '/api/')
    .replace('/route.ts', '')
    .replace(/\[([^\]]+)\]/g, '{$1}');
  
  let doc = `/**
 * @swagger
 * ${routePath}:
`;
  
  for (const [method, config] of Object.entries(methods)) {
    doc += ` *   ${method.toLowerCase()}:
 *     summary: ${config.summary}
 *     description: ${config.description}
 *     tags: ${JSON.stringify(config.tags)}
`;
    
    if (config.security) {
      doc += ` *     security:
 *       - bearerAuth: []
`;
    }
    
    if (config.pathParams) {
      doc += ` *     parameters:
`;
      for (const [key, value] of Object.entries(config.pathParams)) {
        doc += ` *       - in: path
 *         name: ${key}
 *         required: ${value.required}
 *         schema:
 *           type: ${value.type}
 *         description: ${value.description || `ID ${key}`}
`;
      }
    }
    
    if (config.queryParams) {
      if (!config.pathParams) {
        doc += ` *     parameters:
`;
      }
      for (const [key, value] of Object.entries(config.queryParams)) {
        doc += ` *       - in: query
 *         name: ${key}
 *         required: ${value.required || false}
 *         schema:
 *           type: ${value.type}
`;
        if (value.enum) {
          doc += ` *           enum: ${JSON.stringify(value.enum)}
`;
        }
        if (value.format) {
          doc += ` *           format: ${value.format}
`;
        }
        if (value.default !== undefined) {
          doc += ` *           default: ${value.default}
`;
        }
        if (value.minItems) {
          doc += ` *           minItems: ${value.minItems}
`;
        }
        if (value.maxItems) {
          doc += ` *           maxItems: ${value.maxItems}
`;
        }
        doc += ` *         description: ${value.description || key}
`;
      }
    }
    
    if (config.body) {
      const contentTypeStr = config.contentType || 'application/json';
      doc += ` *     requestBody:
 *       required: true
 *       content:
 *         ${contentTypeStr}:
`;
      
      if (contentTypeStr === 'multipart/form-data') {
        doc += ` *           schema:
 *             type: object
 *             properties:
`;
        for (const [key, value] of Object.entries(config.body)) {
          doc += ` *               ${key}:
`;
          if (value.format === 'binary') {
            doc += ` *                 type: string
 *                 format: binary
`;
          } else if (value.type === 'array') {
            doc += ` *                 type: array
 *                 items:
 *                   type: ${value.items.type}
`;
            if (value.items.format) {
              doc += ` *                   format: ${value.items.format}
`;
            }
          } else {
            doc += ` *                 type: ${value.type}
`;
          }
          if (value.enum) doc += ` *                 enum: ${JSON.stringify(value.enum)}
`;
          if (value.description) doc += ` *                 description: ${value.description}
`;
          if (value.example !== undefined) {
            if (typeof value.example === 'string') {
              doc += ` *                 example: "${value.example}"
`;
            } else {
              doc += ` *                 example: ${JSON.stringify(value.example)}
`;
            }
          }
          if (value.minItems) doc += ` *                 minItems: ${value.minItems}
`;
          if (value.maxItems) doc += ` *                 maxItems: ${value.maxItems}
`;
        }
      } else {
        doc += ` *           schema:
 *             type: object
 *             required:
`;
        const required = Object.entries(config.body).filter(([_, v]) => v.required).map(([k]) => k);
        required.forEach(r => {
          doc += ` *               - ${r}
`;
        });
        
        doc += ` *             properties:
`;
        for (const [key, value] of Object.entries(config.body)) {
          doc += ` *               ${key}:
 *                 type: ${value.type}
`;
          if (value.format) doc += ` *                 format: ${value.format}
`;
          if (value.enum) doc += ` *                 enum: ${JSON.stringify(value.enum)}
`;
          if (value.items) {
            doc += ` *                 items:
 *                   type: ${value.items.type}
`;
            if (value.items.format) {
              doc += ` *                   format: ${value.items.format}
`;
            }
          }
          if (value.description) doc += ` *                 description: ${value.description}
`;
          if (value.example !== undefined) {
            if (typeof value.example === 'string') {
              doc += ` *                 example: "${value.example}"
`;
            } else {
              doc += ` *                 example: ${JSON.stringify(value.example)}
`;
            }
          }
          if (value.default !== undefined) {
            doc += ` *                 default: ${value.default}
`;
          }
        }
      }
    }
    
    doc += ` *     responses:
 *       200:
 *         description: Succès
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Ressource non trouvée
 *       500:
 *         description: Erreur serveur
`;
  }
  
  doc += ` */`;
  
  return doc;
}

// Process each route
for (const [filePath, methods] of Object.entries(routeConfigs)) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - not found`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Remove old swagger doc
  const swaggerStart = content.indexOf('/**\n * @swagger');
  if (swaggerStart !== -1) {
    let swaggerEnd = content.indexOf(' */', swaggerStart);
    if (swaggerEnd === -1) swaggerEnd = content.indexOf('\n */', swaggerStart);
    if (swaggerEnd !== -1) {
      swaggerEnd += 3;
      // Find the next non-empty line
      let nextLine = swaggerEnd;
      while (nextLine < content.length && (content[nextLine] === '\n' || content[nextLine] === ' ' || content[nextLine] === '*')) {
        if (content[nextLine] === '\n') nextLine++;
        else break;
      }
      content = content.substring(0, swaggerStart) + generateSwaggerDoc(filePath, methods) + '\n\n' + content.substring(nextLine);
    } else {
      content = generateSwaggerDoc(filePath, methods) + '\n\n' + content;
    }
  } else {
    // Insert at the beginning
    content = generateSwaggerDoc(filePath, methods) + '\n\n' + content;
  }
  
  fs.writeFileSync(fullPath, content);
  console.log(`Updated ${filePath}`);
}

console.log('Done!');













