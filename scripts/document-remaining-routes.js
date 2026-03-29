const fs = require('fs');
const path = require('path');

// Configuration pour toutes les routes restantes
const routeConfigs = {
  // Conversations - routes manquantes
  'app/api/conversations/[id]/mute/route.ts': {
    PATCH: {
      summary: 'Activer ou désactiver les notifications d\'une conversation',
      description: 'Met à jour le statut de notification (muet/non muet) d\'une conversation pour l\'utilisateur connecté.',
      tags: ['Messagerie'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de la conversation' }
      },
      body: {
        muted: { type: 'boolean', required: false, default: true, description: 'true pour couper les notifications, false pour les activer' }
      }
    }
  },
  'app/api/conversations/group/route.ts': {
    POST: {
      summary: 'Créer une conversation de groupe',
      description: 'Crée une nouvelle conversation de groupe avec plusieurs participants. Le créateur devient automatiquement admin.',
      tags: ['Messagerie'],
      security: true,
      body: {
        title: { type: 'string', required: true, example: 'Groupe Trajet École ABC', description: 'Titre de la conversation' },
        participant_ids: { type: 'array', items: { type: 'integer' }, required: true, example: [1, 2, 3], description: 'IDs des participants (minimum 2)' },
        trip_id: { type: 'integer', required: false, description: 'ID du trajet associé (optionnel)' }
      }
    }
  },
  // Evaluations
  'app/api/evaluations/route.ts': {
    GET: {
      summary: 'Récupérer les évaluations',
      description: 'Récupère les évaluations avec filtres optionnels (driver_id, parent_id, rating, etc.).',
      tags: ['Parents'],
      security: true,
      queryParams: {
        driver_id: { type: 'integer', required: false, description: 'Filtrer par ID du chauffeur' },
        parent_id: { type: 'integer', required: false, description: 'Filtrer par ID du parent' },
        min_rating: { type: 'integer', required: false, description: 'Note minimale (1-5)' },
        limit: { type: 'integer', required: false, default: 20, description: 'Nombre d\'évaluations à retourner' },
        offset: { type: 'integer', required: false, default: 0, description: 'Offset pour la pagination' }
      }
    },
    POST: {
      summary: 'Créer une évaluation',
      description: 'Permet à un parent de créer une évaluation pour un trajet complété. Le trajet doit être en statut "completed".',
      tags: ['Parents'],
      security: true,
      body: {
        trip_id: { type: 'integer', required: true, example: 1, description: 'ID du trajet complété' },
        driver_id: { type: 'integer', required: true, example: 1, description: 'ID du chauffeur' },
        rating: { type: 'integer', required: true, minimum: 1, maximum: 5, example: 5, description: 'Note de 1 à 5' },
        comment: { type: 'string', required: false, example: 'Excellent service !', description: 'Commentaire (optionnel)' }
      }
    }
  },
  'app/api/evaluations/[id]/route.ts': {
    PUT: {
      summary: 'Modifier un avis',
      description: 'Permet à un parent de modifier son évaluation. Seul le parent qui a créé l\'évaluation peut la modifier.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'évaluation' }
      },
      body: {
        rating: { type: 'integer', required: true, minimum: 1, maximum: 5, example: 4, description: 'Nouvelle note de 1 à 5' },
        comment: { type: 'string', required: false, example: 'Très bon service', description: 'Nouveau commentaire (optionnel)' }
      }
    }
  },
  // Schools
  'app/api/schools/route.ts': {
    GET: {
      summary: 'Récupérer toutes les écoles',
      description: 'Récupère la liste de toutes les écoles triées par nom.',
      tags: ['ADMIN']
    },
    POST: {
      summary: 'Créer une nouvelle école',
      description: 'Crée une nouvelle école avec logo et horaires. Utilise form-data pour l\'upload du logo.',
      tags: ['ADMIN'],
      body: {
        name: { type: 'string', required: true, example: 'École ABC' },
        address: { type: 'string', required: true, example: 'Dakar, Almadies' },
        opening_time: { type: 'string', required: false, default: '08:00', example: '08:00', description: 'Heure d\'ouverture (HH:MM)' },
        closing_time: { type: 'string', required: false, default: '18:00', example: '18:00', description: 'Heure de fermeture (HH:MM)' },
        schedule: { type: 'string', required: false, description: 'Horaires hebdomadaires en JSON' },
        logo: { type: 'string', format: 'binary', required: false, description: 'Logo de l\'école (fichier image)' }
      },
      contentType: 'multipart/form-data'
    }
  },
  'app/api/schools/[id]/route.ts': {
    GET: {
      summary: 'Récupérer une école par son ID',
      description: 'Récupère les informations détaillées d\'une école spécifique.',
      tags: ['ADMIN'],
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'école' }
      }
    },
    PUT: {
      summary: 'Mettre à jour une école',
      description: 'Met à jour les informations d\'une école (nom, adresse, horaires, logo). Utilise form-data.',
      tags: ['ADMIN'],
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'école' }
      },
      body: {
        name: { type: 'string', required: true, example: 'École ABC' },
        address: { type: 'string', required: true, example: 'Dakar, Almadies' },
        opening_time: { type: 'string', required: false, example: '08:00' },
        closing_time: { type: 'string', required: false, example: '18:00' },
        schedule: { type: 'string', required: false, description: 'Horaires en JSON' },
        logo: { type: 'string', format: 'binary', required: false, description: 'Nouveau logo (fichier image)' }
      },
      contentType: 'multipart/form-data'
    },
    PATCH: {
      summary: 'Mettre à jour le statut d\'une école',
      description: 'Change le statut d\'une école (Actif/Inactif).',
      tags: ['ADMIN'],
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'école' }
      },
      body: {
        status: { type: 'string', required: true, enum: ['Actif', 'Inactif'], example: 'Actif' }
      }
    },
    DELETE: {
      summary: 'Supprimer une école',
      description: 'Supprime une école et son logo associé.',
      tags: ['ADMIN'],
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'école' }
      }
    }
  },
  // Users
  'app/api/users/route.ts': {
    GET: {
      summary: 'Récupérer tous les utilisateurs',
      description: 'Récupère la liste de tous les utilisateurs. Réservé aux administrateurs.',
      tags: ['ADMIN'],
      security: true
    },
    POST: {
      summary: 'Créer un utilisateur',
      description: 'Crée un nouvel utilisateur (admin, parent ou chauffeur). Réservé aux administrateurs.',
      tags: ['ADMIN'],
      security: true,
      body: {
        name: { type: 'string', required: true, example: 'Jean Dupont' },
        email: { type: 'string', format: 'email', required: true, example: 'user@example.com' },
        phone: { type: 'string', required: false, example: '+221771234567' },
        password: { type: 'string', format: 'password', required: false, example: 'password123', description: 'Mot de passe (optionnel, généré automatiquement si absent)' },
        role: { type: 'string', required: true, enum: ['admin', 'parent', 'driver'], example: 'parent' },
        address: { type: 'string', required: false, example: 'Dakar, Almadies' },
        status: { type: 'string', required: false, enum: ['active', 'inactive'], default: 'active' }
      }
    }
  },
  'app/api/users/[id]/route.ts': {
    GET: {
      summary: 'Récupérer un utilisateur par ID',
      description: 'Récupère les informations d\'un utilisateur spécifique. Réservé aux administrateurs.',
      tags: ['ADMIN'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'utilisateur' }
      }
    },
    PUT: {
      summary: 'Mettre à jour un utilisateur',
      description: 'Met à jour les informations d\'un utilisateur. Réservé aux administrateurs.',
      tags: ['ADMIN'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'utilisateur' }
      },
      body: {
        name: { type: 'string', required: false, example: 'Jean Dupont' },
        email: { type: 'string', format: 'email', required: false, example: 'user@example.com' },
        phone: { type: 'string', required: false, example: '+221771234567' },
        password: { type: 'string', format: 'password', required: false, description: 'Nouveau mot de passe' },
        role: { type: 'string', required: false, enum: ['admin', 'parent', 'driver'] },
        address: { type: 'string', required: false },
        status: { type: 'string', required: false, enum: ['active', 'inactive'] }
      }
    },
    DELETE: {
      summary: 'Supprimer un utilisateur',
      description: 'Supprime un utilisateur de la base de données. Réservé aux administrateurs.',
      tags: ['ADMIN'],
      security: true,
      pathParams: {
        id: { type: 'integer', required: true, description: 'ID de l\'utilisateur' }
      }
    }
  },
  // Dashboard
  'app/api/dashboard/route.ts': {
    GET: {
      summary: 'Récupérer les statistiques du tableau de bord',
      description: 'Récupère toutes les statistiques pour le tableau de bord administrateur : nombre d\'utilisateurs, trajets, revenus mensuels, etc.',
      tags: ['ADMIN'],
      security: true
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
 *         description: ${value.description}
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
        if (value.minimum !== undefined) {
          doc += ` *           minimum: ${value.minimum}
`;
        }
        if (value.maximum !== undefined) {
          doc += ` *           maximum: ${value.maximum}
`;
        }
        if (value.default !== undefined) {
          doc += ` *           default: ${value.default}
`;
        }
        if (value.items) {
          doc += ` *           items:
 *             type: ${value.items.type}
`;
        }
        doc += ` *         description: ${value.description}
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
          if (value.default !== undefined) {
            doc += ` *                 default: ${value.default}
`;
          }
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
          if (value.minimum !== undefined) doc += ` *                 minimum: ${value.minimum}
`;
          if (value.maximum !== undefined) doc += ` *                 maximum: ${value.maximum}
`;
          if (value.items) {
            doc += ` *                 items:
 *                   type: ${value.items.type}
`;
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













