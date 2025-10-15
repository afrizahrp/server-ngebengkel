-- AlterTable
ALTER TABLE "public"."sys_User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."sys_EmailVerification" (
    "id" VARCHAR(50) NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sys_EmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_EmailVerification_token_key" ON "public"."sys_EmailVerification"("token");

-- CreateIndex
CREATE INDEX "sys_EmailVerification_user_id_idx" ON "public"."sys_EmailVerification"("user_id");

-- AddForeignKey
ALTER TABLE "public"."sys_EmailVerification" ADD CONSTRAINT "sys_EmailVerification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
