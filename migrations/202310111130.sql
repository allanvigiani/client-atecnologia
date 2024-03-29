\c atecnologia;

-- CreateTable: company
CREATE TABLE IF NOT EXISTS "company" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "address" VARCHAR(250),
    "login attempts" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for company
CREATE UNIQUE INDEX IF NOT EXISTS "company_email_key" ON "company" ("email");
CREATE UNIQUE INDEX IF NOT EXISTS "company_name_key" ON "company" ("name");

-- CreateTable: company_sessions
CREATE TABLE IF NOT EXISTS "company_sessions" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "start_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_login" TIMESTAMP(3),
    "token" TEXT,
    CONSTRAINT "company_sessions_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "company_sessions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable: services
CREATE TABLE IF NOT EXISTS "services" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "professional_name" TEXT,
    "price" DOUBLE PRECISION,
    "service_type_id" INTEGER NOT NULL,
    "other_service_type" VARCHAR(120),
    "service_hours_id" TEXT,
    "service_days_id" TEXT,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "services_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "services_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    CONSTRAINT "services_type_id_fkey" FOREIGN KEY ("service_type_id") REFERENCES "service_type" ("id")
);

-- CreateTable: service_hours
CREATE TABLE IF NOT EXISTS "service_hours" (
    "id" SERIAL NOT NULL,
    "start_time" TIME NOT NULL,
    CONSTRAINT "service_hours_pkey" PRIMARY KEY ("id")
);

-- INSERTs for service_hours
INSERT INTO service_hours (id, start_time) VALUES 
(1, '07:00:00'), (2, '08:00:00'), (3, '09:00:00'), (4, '10:00:00'),
(5, '11:00:00'), (6, '12:00:00'), (7, '13:00:00'), (8, '14:00:00'),
(9, '15:00:00'), (10, '16:00:00'), (11, '17:00:00'), (12, '18:00:00'),
(13, '19:00:00'), (14, '20:00:00'), (15, '21:00:00'), (16, '22:00:00');

-- CreateTable: service_days
CREATE TABLE IF NOT EXISTS "service_days" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    CONSTRAINT "service_days_pkey" PRIMARY KEY ("id")
);

-- INSERTs for service_days
INSERT INTO service_days (id, description) VALUES 
(1, 'Segunda'), (2, 'Terça'), (3, 'Quarta'), (4, 'Quinta'),
(5, 'Sexta'), (6, 'Sábado'), (7, 'Domingo');

-- CreateTable: service_type
CREATE TABLE IF NOT EXISTS "service_type" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    CONSTRAINT "service_type_pkey" PRIMARY KEY ("id")
);

-- INSERTs for service_type
INSERT INTO service_type (id, description) VALUES 
(1, 'Automotivos'), (2, 'Beleza e Bem-estar'), (3, 'Construção'), (4, 'Educação'),
(5, 'Gastronomia'), (6, 'Imobiliários'), (7, 'Lazer'), (8, 'Pet Care'), (9, 'Saúde'), (10, 'Outro');

-- CreateTable: schedule
CREATE TABLE IF NOT EXISTS "schedule" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_hour_id" INTEGER NOT NULL,
    "service_day_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),
    CONSTRAINT "schedule_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "schedule_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "schedule_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "schedule_service_hour_id_fkey" FOREIGN KEY ("service_hour_id") REFERENCES "service_hours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "schedule_service_day_id_fkey" FOREIGN KEY ("service_day_id") REFERENCES "service_days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

