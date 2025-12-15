BEGIN;

CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(150) NOT NULL,
                       email VARCHAR(150) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(20) NOT NULL CHECK (role IN ('admin','parent','driver')),
                       phone VARCHAR(30),
                       status VARCHAR(20) DEFAULT 'active',

                       created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE users
    ADD COLUMN address TEXT;

CREATE TABLE schools (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(200) NOT NULL,
                         address TEXT,
                         opening_time TIME,
                         closing_time TIME
);

ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS logo_url TEXT;
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Actif'
        CHECK (status IN ('Actif', 'Inactif'));

-- Update existing schools to have 'Actif' status if they don't have one
UPDATE schools SET status = 'Actif' WHERE status IS NULL;

-- Add schedule column to schools table to store daily schedules as JSON
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS schedule JSONB DEFAULT '[
      {"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
      {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"},
      {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}
    ]'::jsonb;

-- Add status column if not exists
ALTER TABLE schools
    ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Actif'
        CHECK (status IN ('Actif', 'Inactif'));

-- Update existing schools to have default schedule and status
UPDATE schools
SET schedule = '[
  {"day": "Lundi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Mardi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Mercredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Jeudi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Vendredi", "open": true, "openTime": "08:00", "closeTime": "18:00"},
  {"day": "Samedi", "open": false, "openTime": "00:00", "closeTime": "00:00"},
  {"day": "Dimanche", "open": false, "openTime": "00:00", "closeTime": "00:00"}
]'::jsonb
WHERE schedule IS NULL;

UPDATE schools SET status = 'Actif' WHERE status IS NULL;


CREATE TABLE children (
                          id SERIAL PRIMARY KEY,
                          parent_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                          name VARCHAR(150) NOT NULL,
                          school_id INTEGER REFERENCES schools(id),
                          address TEXT,
                          created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE drivers (
                         id SERIAL PRIMARY KEY,
                         user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                         vehicle_brand TEXT ,         -- marque du véhicule
                         vehicle_color TEXT NOT NULL,         -- couleur du véhicule
                         vehicle_plate TEXT NOT NULL,         -- immatriculation du véhicule
                         license_document TEXT NOT NULL,      -- chemin/URL de la CNI de conduire
                         id_document TEXT NOT NULL,           -- chemin/URL du permis ou passeport
                         vehicle_photo TEXT NOT NULL  ,       -- chemin/URL de la photo du véhicule
                         created_at TIMESTAMP DEFAULT now()

);

ALTER TABLE drivers
    ADD COLUMN status VARCHAR(20) DEFAULT 'En attente'
        CHECK (status IN ('En attente', 'Approuvé', 'Refusé')),
    ADD CONSTRAINT unique_vehicle_plate UNIQUE (vehicle_plate),
    ADD CONSTRAINT unique_driver_user UNIQUE (user_id);





CREATE TABLE trips (
                       id SERIAL PRIMARY KEY,
                       driver_id INTEGER REFERENCES drivers(id),
                       school_id INTEGER REFERENCES schools(id),
                       date TIMESTAMP,
                       start_time TIME,
                       end_time TIME,
                       status VARCHAR(20) DEFAULT 'En cours' CHECK (status IN ('En cours','Termine','Annule' )),
                       is_recurring BOOLEAN DEFAULT FALSE,
                       created_at TIMESTAMP DEFAULT now()
);
ALTER TABLE trips
    DROP COLUMN date,
    DROP COLUMN start_time,
    DROP COLUMN end_time;

ALTER TABLE trips
ADD COLUMN  start_point VARCHAR(255) NOT NULL,
 ADD COLUMN   end_point VARCHAR(255) NOT NULL,

  ADD COLUMN    departure_time TIMESTAMP NOT NULL,

  ADD COLUMN   capacity_max INTEGER NOT NULL CHECK (capacity_max > 0);


CREATE TABLE trip_children (
                               trip_id INTEGER REFERENCES trips(id) ON DELETE CASCADE,
                               child_id INTEGER REFERENCES children(id) ON DELETE CASCADE,
                               PRIMARY KEY (trip_id, child_id)
);

CREATE TABLE payments (
                          id SERIAL PRIMARY KEY,
                          user_id INTEGER REFERENCES users(id),
                          amount NUMERIC(10,2) NOT NULL,
                          status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('paid','pending','failed')),
                          method VARCHAR(50),
                          transaction_id VARCHAR(200),
                          created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE evaluations (
                             id SERIAL PRIMARY KEY,
                             trip_id INTEGER REFERENCES trips(id),
                             parent_id INTEGER REFERENCES users(id),
                             driver_id INTEGER REFERENCES drivers(id),
                             rating SMALLINT CHECK (rating BETWEEN 1 AND 5),
                             comment TEXT,
                             created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE notifications (
                               id SERIAL PRIMARY KEY,
                               user_id INTEGER REFERENCES users(id),
                               type VARCHAR(50),
                               message TEXT,
                               read BOOLEAN DEFAULT FALSE,
                               created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE subscriptions (
                               id SERIAL PRIMARY KEY,
                               user_id INTEGER REFERENCES users(id),
                               type VARCHAR(100),
                               price NUMERIC(10,2),
                               active BOOLEAN DEFAULT TRUE,
                               created_at TIMESTAMP DEFAULT now(),
                               updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE support_tickets (
                                 id SERIAL PRIMARY KEY,
                                 user_id INTEGER REFERENCES users(id),
                                 subject VARCHAR(200),
                                 message TEXT,
                                 status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
                                 created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE password_resets (
                                 id SERIAL PRIMARY KEY,
                                 user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                                 code CHAR(4) NOT NULL,
                                 expires_at TIMESTAMP NOT NULL,
                                 created_at TIMESTAMP DEFAULT now()
);

-- Vues pour dashboard
CREATE VIEW dashboard_user_counts AS
SELECT role, count(*) as total FROM users GROUP BY role;

CREATE VIEW dashboard_revenue_monthly AS
SELECT date_trunc('month', created_at) as month, sum(amount) as total
FROM payments WHERE status='paid' GROUP BY 1 ORDER BY 1 DESC;





-- trips stats
CREATE VIEW v_trips_stats AS
SELECT status, count(*) AS total FROM trips GROUP BY status;


COMMIT;
