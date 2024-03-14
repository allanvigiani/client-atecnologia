\c atecnologia;

-- CreateTable
CREATE TABLE IF NOT EXISTS "company" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "address" VARCHAR(250),
    "login_attempts" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
CONSTRAINT "company_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE IF NOT EXISTS "company_sessions" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "start_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_login" TIMESTAMP(3),
    "token" TEXT,
CONSTRAINT "company_sessions_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE IF NOT EXISTS "services" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "professional_name" TEXT,
    "price" DOUBLE PRECISION,
    "deleted_at" TIMESTAMP(3),
CONSTRAINT "services_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE IF NOT EXISTS "service_hours" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "start_time" TIME NOT NULL,
CONSTRAINT "service_hours_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE IF NOT EXISTS "schedule" (
    "id" SERIAL NOT NULL,
    "company_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_hour_id" INTEGER NOT NULL,
    "schedule_date" VARCHAR(25),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),


CONSTRAINT "schedule_pkey" PRIMARY KEY ("id") );

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "company_email_key" ON "company" ("email");

CREATE UNIQUE INDEX IF NOT EXISTS "company_name_key" ON "company" ("name");

-- AddForeignKey
ALTER TABLE "company_sessions"
ADD CONSTRAINT "company_sessions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "services"
ADD CONSTRAINT "services_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "schedule"
ADD CONSTRAINT "schedule_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_hours"
ADD CONSTRAINT "service_hours_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule"
ADD CONSTRAINT "schedule_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule"
ADD CONSTRAINT "schedule_service_hour_id_fkey" FOREIGN KEY ("service_hour_id") REFERENCES "service_hours" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schedule"
ADD CONSTRAINT "schedule_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;