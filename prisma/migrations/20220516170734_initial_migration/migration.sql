-- CreateTable
CREATE TABLE "ElectricityPrice" (
    "datetime" TEXT NOT NULL,
    "datetime_utc" TEXT NOT NULL,
    "tz_time" TEXT NOT NULL,
    "geo_id" INTEGER NOT NULL,
    "geo_name" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ElectricityPrice_pkey" PRIMARY KEY ("datetime_utc","geo_id")
);
