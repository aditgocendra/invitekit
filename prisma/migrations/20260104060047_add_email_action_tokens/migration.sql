-- CreateTable
CREATE TABLE "email_action_tokens" (
    "id" TEXT NOT NULL,
    "jti" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_action_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_action_tokens_jti_key" ON "email_action_tokens"("jti");

-- CreateIndex
CREATE INDEX "email_action_tokens_email_type_idx" ON "email_action_tokens"("email", "type");
