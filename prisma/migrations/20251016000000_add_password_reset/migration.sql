-- CreateTable
CREATE TABLE "sys_PasswordReset" (
    "id" SERIAL NOT NULL,
    "user_id" SMALLINT NOT NULL,
    "token" VARCHAR(255) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "used" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sys_PasswordReset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sys_PasswordReset_token_key" ON "sys_PasswordReset"("token");

-- CreateIndex
CREATE INDEX "sys_PasswordReset_token_idx" ON "sys_PasswordReset"("token");

-- CreateIndex
CREATE INDEX "sys_PasswordReset_user_id_idx" ON "sys_PasswordReset"("user_id");

-- AddForeignKey
ALTER TABLE "sys_PasswordReset" ADD CONSTRAINT "sys_PasswordReset_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "sys_User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

