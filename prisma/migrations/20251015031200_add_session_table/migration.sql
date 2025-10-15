-- CreateTable
CREATE TABLE "public"."sys_Session" (
    "id" VARCHAR(50) NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "refreshToken" VARCHAR(500) NOT NULL,
    "deviceName" VARCHAR(255),
    "deviceType" VARCHAR(50),
    "browser" VARCHAR(100),
    "os" VARCHAR(100),
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "revokedReason" VARCHAR(255),
    "iStatus" "public"."MasterRecordStatusEnum" NOT NULL DEFAULT '1',

    CONSTRAINT "sys_Session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_Session_refreshToken_key" ON "public"."sys_Session"("refreshToken");

-- CreateIndex
CREATE INDEX "sys_Session_user_id_idx" ON "public"."sys_Session"("user_id");

-- CreateIndex
CREATE INDEX "sys_Session_refreshToken_idx" ON "public"."sys_Session"("refreshToken");

-- CreateIndex
CREATE INDEX "sys_Session_isActive_idx" ON "public"."sys_Session"("isActive");

-- AddForeignKey
ALTER TABLE "public"."sys_Session" ADD CONSTRAINT "sys_Session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
