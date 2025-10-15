-- AlterTable
ALTER TABLE "public"."sys_User" ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."sys_TwoFactorToken" (
    "id" VARCHAR(50) NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "code" VARCHAR(6) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_TwoFactorToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sys_TwoFactorToken_user_id_idx" ON "public"."sys_TwoFactorToken"("user_id");

-- CreateIndex
CREATE INDEX "sys_TwoFactorToken_code_idx" ON "public"."sys_TwoFactorToken"("code");

-- AddForeignKey
ALTER TABLE "public"."sys_TwoFactorToken" ADD CONSTRAINT "sys_TwoFactorToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
