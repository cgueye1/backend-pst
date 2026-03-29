const fs = require('fs');
const path = require('path');

// Configuration pour toutes les routes parents
const routeConfigs = {
  'app/api/parents/dashboard/route.ts': {
    GET: {
      summary: 'Tableau de bord parent',
      description: 'Récupère les statistiques du tableau de bord : trajets à venir, enfants, réservations récentes, etc.',
      tags: ['Parents'],
      security: true
    }
  },
  'app/api/parents/reservations/route.ts': {
    GET: {
      summary: 'Récupérer les réservations',
      description: 'Récupère toutes les réservations du parent avec filtres optionnels.',
      tags: ['Parents'],
      security: true,
      queryParams: {
        status: { type: 'string', required: false, enum: ['pending', 'confirmed', 'completed', 'canceled'] },
        child_id: { type: 'integer', required: false },
        trip_id: { type: 'integer', required: false }
      }
    },
    POST: {
      summary: 'Réserver un trajet',
      description: 'Permet à un parent de réserver un trajet pour un ou plusieurs enfants.',
      tags: ['Parents'],
      security: true,
      body: {
        trip_id: { type: 'integer', required: true, example: 1, description: 'ID du trajet' },
        child_ids: { type: 'array', items: { type: 'integer' }, required: true, example: [1, 2], description: 'IDs des enfants' },
        is_recurring: { type: 'boolean', required: false, default: false, description: 'Réservation récurrente' }
      }
    }
  },
  'app/api/parents/reservations/[tripId]/[childId]/route.ts': {
    DELETE: {
      summary: 'Annuler une réservation',
      description: 'Annule une réservation spécifique pour un enfant.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        tripId: { type: 'integer', required: true, description: 'ID du trajet' },
        childId: { type: 'integer', required: true, description: 'ID de l\'enfant' }
      }
    }
  },
  'app/api/parents/children/route.ts': {
    GET: {
      summary: 'Récupérer tous les enfants du parent',
      description: 'Retourne la liste de tous les enfants avec leurs horaires personnalisés.',
      tags: ['Parents'],
      security: true
    },
    POST: {
      summary: 'Ajouter un ou plusieurs enfants',
      description: 'Ajoute un ou plusieurs enfants au compte du parent.',
      tags: ['Parents'],
      security: true,
      body: {
        name: { type: 'string', required: true, example: 'Marie Dupont' },
        address: { type: 'string', required: true, example: 'Dakar, Almadies' },
        school_id: { type: 'integer', required: true, example: 1, description: 'ID de l\'école' },
        birth_date: { type: 'string', format: 'date', required: false, example: '2015-05-15' },
        grade: { type: 'string', required: false, example: 'CE1' }
      }
    }
  },
  'app/api/parents/children/[childId]/route.ts': {
    GET: {
      summary: 'Récupérer un enfant par ID',
      description: 'Récupère les informations détaillées d\'un enfant spécifique.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        childId: { type: 'integer', required: true, description: 'ID de l\'enfant' }
      }
    },
    PUT: {
      summary: 'Mettre à jour un enfant',
      description: 'Met à jour les informations d\'un enfant.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        childId: { type: 'integer', required: true }
      },
      body: {
        name: { type: 'string', required: false },
        address: { type: 'string', required: false },
        school_id: { type: 'integer', required: false },
        birth_date: { type: 'string', format: 'date', required: false },
        grade: { type: 'string', required: false }
      }
    },
    DELETE: {
      summary: 'Supprimer un enfant',
      description: 'Supprime un enfant du compte du parent.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        childId: { type: 'integer', required: true }
      }
    }
  },
  'app/api/parents/children/[childId]/location/route.ts': {
    PUT: {
      summary: 'Mettre à jour la localisation d\'un enfant',
      description: 'Met à jour la localisation GPS d\'un enfant.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        childId: { type: 'integer', required: true }
      },
      body: {
        latitude: { type: 'number', format: 'float', required: true, example: 14.7167 },
        longitude: { type: 'number', format: 'float', required: true, example: -17.4677 }
      }
    }
  },
  'app/api/parents/children/schedules/route.ts': {
    GET: {
      summary: 'Récupérer les horaires des enfants',
      description: 'Récupère les horaires personnalisés de tous les enfants du parent.',
      tags: ['Parents'],
      security: true
    },
    PUT: {
      summary: 'Mettre à jour les horaires d\'un enfant',
      description: 'Met à jour les horaires personnalisés d\'un enfant.',
      tags: ['Parents'],
      security: true,
      body: {
        child_id: { type: 'integer', required: true },
        schedule: { type: 'object', required: true, description: 'Horaires hebdomadaires en JSON' }
      }
    }
  },
  'app/api/parents/children-trips/route.ts': {
    GET: {
      summary: 'Récupérer les trajets des enfants',
      description: 'Récupère tous les trajets associés aux enfants du parent.',
      tags: ['Parents'],
      security: true,
      queryParams: {
        child_id: { type: 'integer', required: false },
        status: { type: 'string', required: false, enum: ['pending', 'completed', 'canceled'] }
      }
    }
  },
  'app/api/parents/account/route.ts': {
    GET: {
      summary: 'Récupérer les informations du compte',
      description: 'Récupère les informations du compte du parent connecté.',
      tags: ['Parents'],
      security: true
    },
    PUT: {
      summary: 'Modifier les informations personnelles',
      description: 'Met à jour les informations personnelles du parent (nom, email, téléphone, adresse, mot de passe).',
      tags: ['Parents'],
      security: true,
      body: {
        name: { type: 'string', required: false },
        email: { type: 'string', format: 'email', required: false },
        phone: { type: 'string', required: false },
        address: { type: 'string', required: false },
        current_password: { type: 'string', format: 'password', required: false, description: 'Mot de passe actuel (requis pour changer le mot de passe)' },
        new_password: { type: 'string', format: 'password', required: false, description: 'Nouveau mot de passe' }
      }
    }
  },
  'app/api/parents/account/photo/route.ts': {
    POST: {
      summary: 'Uploader une photo de profil',
      description: 'Upload une nouvelle photo de profil pour le parent.',
      tags: ['Parents'],
      security: true,
      body: {
        photo: { type: 'string', format: 'binary', required: true, description: 'Fichier image (JPG, PNG, WEBP)' }
      },
      contentType: 'multipart/form-data'
    },
    DELETE: {
      summary: 'Supprimer la photo de profil',
      description: 'Supprime la photo de profil du parent.',
      tags: ['Parents'],
      security: true
    }
  },
  'app/api/parents/payment/route.ts': {
    POST: {
      summary: 'Effectuer un paiement',
      description: 'Initie un paiement pour une réservation ou un abonnement.',
      tags: ['Parents'],
      security: true,
      body: {
        amount: { type: 'number', format: 'float', required: true, example: 5000, description: 'Montant en FCFA' },
        reservation_id: { type: 'integer', required: false, description: 'ID de la réservation' },
        subscription_id: { type: 'integer', required: false, description: 'ID de l\'abonnement' },
        payment_method: { type: 'string', required: true, enum: ['mobile_money', 'card'], example: 'mobile_money' }
      }
    }
  },
  'app/api/parents/alertes/route.ts': {
    GET: {
      summary: 'Récupérer les alertes',
      description: 'Récupère les alertes du parent (notifications importantes).',
      tags: ['Parents'],
      security: true,
      queryParams: {
        unread_only: { type: 'boolean', required: false, default: false }
      }
    },
    POST: {
      summary: 'Créer une alerte',
      description: 'Crée une nouvelle alerte pour le parent.',
      tags: ['Parents'],
      security: true,
      body: {
        title: { type: 'string', required: true, example: 'Alerte importante' },
        message: { type: 'string', required: true, example: 'Message de l\'alerte' },
        type: { type: 'string', required: false, enum: ['info', 'warning', 'error'], default: 'info' }
      }
    }
  },
  'app/api/parents/trips/search/route.ts': {
    GET: {
      summary: 'Rechercher des trajets',
      description: 'Recherche des trajets disponibles selon des critères (point de départ, destination, date, etc.).',
      tags: ['Parents'],
      security: true,
      queryParams: {
        start_point: { type: 'string', required: false, description: 'Point de départ' },
        end_point: { type: 'string', required: false, description: 'Point d\'arrivée' },
        date: { type: 'string', format: 'date', required: false, description: 'Date du trajet' },
        school_id: { type: 'integer', required: false },
        available_seats: { type: 'integer', required: false, description: 'Nombre de places disponibles minimum' }
      }
    }
  },
  'app/api/parents/trips/filters/route.ts': {
    GET: {
      summary: 'Récupérer les filtres de recherche',
      description: 'Récupère les options de filtres disponibles pour la recherche de trajets.',
      tags: ['Parents'],
      security: true
    }
  },
  'app/api/parents/trips/[tripId]/details/route.ts': {
    GET: {
      summary: 'Récupérer les détails d\'un trajet',
      description: 'Récupère les détails complets d\'un trajet spécifique.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        tripId: { type: 'integer', required: true, description: 'ID du trajet' }
      }
    }
  },
  'app/api/parents/trips/[tripId]/realtime/route.ts': {
    GET: {
      summary: 'Suivre un trajet en temps réel',
      description: 'Récupère les informations de suivi GPS en temps réel d\'un trajet.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        tripId: { type: 'integer', required: true, description: 'ID du trajet' }
      }
    }
  },
  'app/api/parents/trips/[tripId]/contact-driver/route.ts': {
    POST: {
      summary: 'Contacter le chauffeur',
      description: 'Initie une conversation avec le chauffeur d\'un trajet.',
      tags: ['Parents'],
      security: true,
      pathParams: {
        tripId: { type: 'integer', required: true, description: 'ID du trajet' }
      },
      body: {
        message: { type: 'string', required: false, example: 'Bonjour, j\'aimerais vous contacter', description: 'Message initial (optionnel)' }
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
        if (value.items) {
          doc += ` *           items:
 *             type: ${value.items.type}
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













