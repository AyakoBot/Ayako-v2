/*
  Warnings:

  - You are about to drop the column `delete` on the `antivirus` table. All the data in the column will be lost.
  - You are about to drop the column `deletetof` on the `antivirus` table. All the data in the column will be lost.
  - You are about to drop the column `minimize` on the `antivirus` table. All the data in the column will be lost.
  - You are about to drop the column `minimizetof` on the `antivirus` table. All the data in the column will be lost.
  - You are about to drop the column `blockinvites` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `invitesaction` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `invitesdeletemessageseconds` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `invitesduration` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `inviteswlchannelid` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `inviteswlroleid` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `maxnewlines` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `newlinesaction` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `newlinesdeletemessageseconds` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `newlinesduration` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `newlineswlchannelid` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `newlineswlroleid` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the column `repostenabled` on the `blacklist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "antivirus" DROP COLUMN "delete",
DROP COLUMN "deletetof",
DROP COLUMN "minimize",
DROP COLUMN "minimizetof",
ADD COLUMN     "action" "PunishmentType" NOT NULL DEFAULT 'warn',
ADD COLUMN     "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,
ADD COLUMN     "duration" DECIMAL NOT NULL DEFAULT 3600;

-- AlterTable
ALTER TABLE "blacklist" DROP COLUMN "blockinvites",
DROP COLUMN "invitesaction",
DROP COLUMN "invitesdeletemessageseconds",
DROP COLUMN "invitesduration",
DROP COLUMN "inviteswlchannelid",
DROP COLUMN "inviteswlroleid",
DROP COLUMN "maxnewlines",
DROP COLUMN "newlinesaction",
DROP COLUMN "newlinesdeletemessageseconds",
DROP COLUMN "newlinesduration",
DROP COLUMN "newlineswlchannelid",
DROP COLUMN "newlineswlroleid",
DROP COLUMN "repostenabled";

-- CreateTable
CREATE TABLE "newlines" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "guildid" VARCHAR NOT NULL,
    "maxnewlines" DECIMAL,
    "wlroleid" VARCHAR[],
    "wlchannelid" VARCHAR[],
    "action" "PunishmentType" NOT NULL DEFAULT 'warn',
    "duration" DECIMAL NOT NULL DEFAULT 3600,
    "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,

    CONSTRAINT "newlines_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "invites" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "guildid" VARCHAR NOT NULL,
    "blockinvites" BOOLEAN NOT NULL DEFAULT false,
    "wlroleid" VARCHAR[],
    "wlchannelid" VARCHAR[],
    "action" "PunishmentType" NOT NULL DEFAULT 'warn',
    "duration" DECIMAL NOT NULL DEFAULT 3600,
    "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("guildid")
);

-- CreateIndex
CREATE INDEX "newlines_guildid_idx" ON "newlines"("guildid");

-- CreateIndex
CREATE INDEX "invites_guildid_idx" ON "invites"("guildid");
