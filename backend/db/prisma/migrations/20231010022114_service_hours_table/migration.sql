-- CreateTable
CREATE TABLE "service_hours" (
    "id" SERIAL NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "service_hours_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_hours" ADD CONSTRAINT "service_hours_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
