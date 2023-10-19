/*
  Warnings:

  - You are about to drop the column `confirmationreq` on the `autopunish` table. All the data in the column will be lost.
  - You are about to drop the column `punishmentawaittime` on the `autopunish` table. All the data in the column will be lost.
  - You are about to drop the column `blockinvites` on the `invites` table. All the data in the column will be lost.
  - The `linkedid` column on the `votesettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `antiraid` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blacklist` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "antispakm" ADD COLUMN     "action" "PunishmentType" NOT NULL DEFAULT 'warn',
ADD COLUMN     "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,
ADD COLUMN     "duration" DECIMAL NOT NULL DEFAULT 3600;

-- AlterTable
ALTER TABLE "autopunish" DROP COLUMN "confirmationreq",
DROP COLUMN "punishmentawaittime";

-- AlterTable
ALTER TABLE "guildsettings" ADD COLUMN     "appid" VARCHAR,
ADD COLUMN     "editrpcommands" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "publickey" TEXT,
ADD COLUMN     "token" VARCHAR;

-- AlterTable
ALTER TABLE "invites" DROP COLUMN "blockinvites";

-- AlterTable
ALTER TABLE "votesettings" DROP COLUMN "linkedid",
ADD COLUMN     "linkedid" DECIMAL;

-- DropTable
DROP TABLE "antiraid";

-- DropTable
DROP TABLE "blacklist";

-- CreateTable
CREATE TABLE "censor" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "guildid" VARCHAR NOT NULL,
    "repostroles" VARCHAR[],
    "repostrules" VARCHAR[],

    CONSTRAINT "censor_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "blockedusers" (
    "userid" VARCHAR NOT NULL,
    "blockeduserid" VARCHAR NOT NULL,
    "blockedcmd" TEXT[],

    CONSTRAINT "blockedusers_pkey" PRIMARY KEY ("userid","blockeduserid")
);

-- CreateIndex
CREATE INDEX "censor_guildid_idx" ON "censor"("guildid");

-- CreateIndex
CREATE INDEX "blockedusers_userid_idx" ON "blockedusers"("userid");
