/*
  Warnings:

  - The `punishment` column on the `autopunish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `punishments_antispam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `punishments_antivirus` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `duration` on table `autopunish` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "AutoPunishPunishmentType" AS ENUM ('warn', 'kick', 'tempmute', 'ban', 'tempban', 'channelban', 'tempchannelban', 'softban');

-- AlterEnum
ALTER TYPE "AnswerType" ADD VALUE 'justtext';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PunishmentType" ADD VALUE 'strike';
ALTER TYPE "PunishmentType" ADD VALUE 'softban';

-- AlterTable
ALTER TABLE "antiraid" ALTER COLUMN "time" SET DEFAULT 15;

-- AlterTable
ALTER TABLE "antivirus" ALTER COLUMN "minimize" SET DEFAULT 10,
ALTER COLUMN "delete" SET DEFAULT 10;

-- AlterTable
ALTER TABLE "autopunish" ADD COLUMN     "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,
ALTER COLUMN "duration" SET NOT NULL,
DROP COLUMN "punishment",
ADD COLUMN     "punishment" "AutoPunishPunishmentType" NOT NULL DEFAULT 'warn';

-- AlterTable
ALTER TABLE "blacklist" ADD COLUMN     "invitesaction" "PunishmentType" NOT NULL DEFAULT 'warn',
ADD COLUMN     "invitesdeletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,
ADD COLUMN     "invitesduration" DECIMAL NOT NULL DEFAULT 3600,
ADD COLUMN     "newlinesaction" "PunishmentType" NOT NULL DEFAULT 'warn',
ADD COLUMN     "newlinesdeletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,
ADD COLUMN     "newlinesduration" DECIMAL NOT NULL DEFAULT 3600,
ALTER COLUMN "maxnewlines" DROP NOT NULL;

-- AlterTable
ALTER TABLE "cooldowns" ALTER COLUMN "cooldown" SET DEFAULT 10;

-- AlterTable
ALTER TABLE "leveling" ALTER COLUMN "lvlupdeltimeout" SET DEFAULT 10;

-- AlterTable
ALTER TABLE "verification" ALTER COLUMN "kickafter" SET DEFAULT 600;

-- DropTable
DROP TABLE "punishments_antispam";

-- DropTable
DROP TABLE "punishments_antivirus";

-- CreateTable
CREATE TABLE "deletethreads" (
    "guildid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "deletetime" DECIMAL NOT NULL,

    CONSTRAINT "deletethreads_pkey" PRIMARY KEY ("guildid")
);

-- CreateIndex
CREATE INDEX "deletethreads_guildid_idx" ON "deletethreads"("guildid");

-- CreateIndex
CREATE INDEX "afk_userid_guildid_idx" ON "afk"("userid", "guildid");

-- CreateIndex
CREATE INDEX "antiraid_guildid_idx" ON "antiraid"("guildid");

-- CreateIndex
CREATE INDEX "antispam_guildid_idx" ON "antispam"("guildid");

-- CreateIndex
CREATE INDEX "antivirus_guildid_idx" ON "antivirus"("guildid");

-- CreateIndex
CREATE INDEX "appealquestions_guildid_idx" ON "appealquestions"("guildid");

-- CreateIndex
CREATE INDEX "appeals_userid_punishmentid_idx" ON "appeals"("userid", "punishmentid");

-- CreateIndex
CREATE INDEX "appealsettings_guildid_idx" ON "appealsettings"("guildid");

-- CreateIndex
CREATE INDEX "art_created_idx" ON "art"("created");

-- CreateIndex
CREATE INDEX "autopunish_guildid_idx" ON "autopunish"("guildid");

-- CreateIndex
CREATE INDEX "autoroles_guildid_idx" ON "autoroles"("guildid");

-- CreateIndex
CREATE INDEX "balance_userid_guildid_idx" ON "balance"("userid", "guildid");

-- CreateIndex
CREATE INDEX "blacklist_guildid_idx" ON "blacklist"("guildid");

-- CreateIndex
CREATE INDEX "buttonroles_guildid_idx" ON "buttonroles"("guildid");

-- CreateIndex
CREATE INDEX "buttonrolesettings_guildid_idx" ON "buttonrolesettings"("guildid");

-- CreateIndex
CREATE INDEX "cooldowns_guildid_idx" ON "cooldowns"("guildid");

-- CreateIndex
CREATE INDEX "customembeds_guildid_idx" ON "customembeds"("guildid");

-- CreateIndex
CREATE INDEX "disboard_guildid_idx" ON "disboard"("guildid");

-- CreateIndex
CREATE INDEX "expiry_guildid_idx" ON "expiry"("guildid");

-- CreateIndex
CREATE INDEX "giveawaycollection_msgid_idx" ON "giveawaycollection"("msgid");

-- CreateIndex
CREATE INDEX "giveaways_msgid_idx" ON "giveaways"("msgid");

-- CreateIndex
CREATE INDEX "guilds_guildid_idx" ON "guilds"("guildid");

-- CreateIndex
CREATE INDEX "guildsettings_guildid_idx" ON "guildsettings"("guildid");

-- CreateIndex
CREATE INDEX "level_guildid_idx" ON "level"("guildid");

-- CreateIndex
CREATE INDEX "leveling_guildid_idx" ON "leveling"("guildid");

-- CreateIndex
CREATE INDEX "levelingmultichannels_guildid_idx" ON "levelingmultichannels"("guildid");

-- CreateIndex
CREATE INDEX "levelingmultiroles_guildid_idx" ON "levelingmultiroles"("guildid");

-- CreateIndex
CREATE INDEX "levelingroles_guildid_idx" ON "levelingroles"("guildid");

-- CreateIndex
CREATE INDEX "levelingruleschannels_guildid_idx" ON "levelingruleschannels"("guildid");

-- CreateIndex
CREATE INDEX "logchannels_guildid_idx" ON "logchannels"("guildid");

-- CreateIndex
CREATE INDEX "nitroroles_guildid_idx" ON "nitroroles"("guildid");

-- CreateIndex
CREATE INDEX "nitrosettings_guildid_idx" ON "nitrosettings"("guildid");

-- CreateIndex
CREATE INDEX "nitrousers_guildid_idx" ON "nitrousers"("guildid");

-- CreateIndex
CREATE INDEX "punish_bans_guildid_userid_idx" ON "punish_bans"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_channelbans_guildid_userid_idx" ON "punish_channelbans"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_kicks_guildid_userid_idx" ON "punish_kicks"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_mutes_guildid_userid_idx" ON "punish_mutes"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_tempbans_guildid_userid_idx" ON "punish_tempbans"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_tempchannelbans_guildid_userid_idx" ON "punish_tempchannelbans"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_tempmutes_guildid_userid_idx" ON "punish_tempmutes"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_warns_guildid_userid_idx" ON "punish_warns"("guildid", "userid");

-- CreateIndex
CREATE INDEX "reactionroles_guildid_idx" ON "reactionroles"("guildid");

-- CreateIndex
CREATE INDEX "reactionrolesettings_guildid_idx" ON "reactionrolesettings"("guildid");

-- CreateIndex
CREATE INDEX "reminders_userid_idx" ON "reminders"("userid");

-- CreateIndex
CREATE INDEX "reviews_userid_idx" ON "reviews"("userid");

-- CreateIndex
CREATE INDEX "rolerewards_guildid_idx" ON "rolerewards"("guildid");

-- CreateIndex
CREATE INDEX "roleseparator_guildid_idx" ON "roleseparator"("guildid");

-- CreateIndex
CREATE INDEX "roleseparatorsettings_guildid_idx" ON "roleseparatorsettings"("guildid");

-- CreateIndex
CREATE INDEX "selfroles_guildid_idx" ON "selfroles"("guildid");

-- CreateIndex
CREATE INDEX "sticky_guildid_idx" ON "sticky"("guildid");

-- CreateIndex
CREATE INDEX "stickymessages_guildid_idx" ON "stickymessages"("guildid");

-- CreateIndex
CREATE INDEX "stickypermmembers_guildid_idx" ON "stickypermmembers"("guildid");

-- CreateIndex
CREATE INDEX "stickyrolemembers_guildid_idx" ON "stickyrolemembers"("guildid");

-- CreateIndex
CREATE INDEX "suggestionsettings_guildid_idx" ON "suggestionsettings"("guildid");

-- CreateIndex
CREATE INDEX "suggestionvotes_guildid_idx" ON "suggestionvotes"("guildid");

-- CreateIndex
CREATE INDEX "users_userid_idx" ON "users"("userid");

-- CreateIndex
CREATE INDEX "verification_guildid_idx" ON "verification"("guildid");

-- CreateIndex
CREATE INDEX "voterewards_guildid_idx" ON "voterewards"("guildid");

-- CreateIndex
CREATE INDEX "voters_userid_idx" ON "voters"("userid");

-- CreateIndex
CREATE INDEX "votesettings_guildid_idx" ON "votesettings"("guildid");

-- CreateIndex
CREATE INDEX "welcome_guildid_idx" ON "welcome"("guildid");
