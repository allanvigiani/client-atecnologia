-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "address" VARCHAR(250),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_sessions" (
    "id" SERIAL NOT NULL,
    "start_login" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_login" TIMESTAMP(3),
    "company_id" INTEGER NOT NULL,

    CONSTRAINT "company_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_email_key" ON "company"("email");

-- AddForeignKey
ALTER TABLE "company_sessions" ADD CONSTRAINT "company_sessions_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
