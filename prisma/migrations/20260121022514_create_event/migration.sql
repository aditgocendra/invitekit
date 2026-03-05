-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'CIRCUMCISION');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('DRAFT', 'ARCHIVED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "SentStatus" AS ENUM ('PENDING', 'FAIL', 'SUCCESS');

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "status" "EventStatus" NOT NULL DEFAULT 'DRAFT',
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "templateKey" TEXT NOT NULL,
    "configJson" JSONB NOT NULL,
    "thumb" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invitation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "token" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "sentStatus" "SentStatus" NOT NULL,

    CONSTRAINT "invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rsvp" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "isAttendance" BOOLEAN NOT NULL,
    "message" TEXT,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "rsvp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invitation_token_key" ON "invitation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "rsvp_invitationId_key" ON "rsvp"("invitationId");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invitation" ADD CONSTRAINT "invitation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rsvp" ADD CONSTRAINT "rsvp_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "invitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
