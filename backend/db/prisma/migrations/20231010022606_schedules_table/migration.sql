-- CreateTable
CREATE TABLE "shedule" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_hour_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_name" TEXT NOT NULL,
    "client_contact" TEXT,
    "client_email" TEXT NOT NULL,
    "status_id" INTEGER NOT NULL,

    CONSTRAINT "shedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shedule" ADD CONSTRAINT "shedule_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shedule" ADD CONSTRAINT "shedule_service_hour_id_fkey" FOREIGN KEY ("service_hour_id") REFERENCES "service_hours"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shedule" ADD CONSTRAINT "shedule_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
