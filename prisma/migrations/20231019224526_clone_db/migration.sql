/*
  Warnings:

  - The primary key for the `appealquestions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `blusers` on the `appealsettings` table. All the data in the column will be lost.
  - You are about to drop the column `blchannels` on the `leveling` table. All the data in the column will be lost.
  - You are about to drop the column `blroles` on the `leveling` table. All the data in the column will be lost.
  - You are about to drop the column `blusers` on the `leveling` table. All the data in the column will be lost.
  - You are about to drop the column `wlchannels` on the `leveling` table. All the data in the column will be lost.
  - You are about to drop the column `wlroles` on the `leveling` table. All the data in the column will be lost.
  - You are about to drop the column `wlusers` on the `leveling` table. All the data in the column will be lost.
  - You are about to drop the column `onlyone` on the `reactionrolesettings` table. All the data in the column will be lost.
  - You are about to drop the column `msgid` on the `reminders` table. All the data in the column will be lost.
  - You are about to drop the column `blroles` on the `rolerewards` table. All the data in the column will be lost.
  - You are about to drop the column `blusers` on the `rolerewards` table. All the data in the column will be lost.
  - You are about to drop the column `blroles` on the `selfroles` table. All the data in the column will be lost.
  - You are about to drop the column `blusers` on the `selfroles` table. All the data in the column will be lost.
  - You are about to drop the column `wlroles` on the `selfroles` table. All the data in the column will be lost.
  - You are about to drop the column `wlusers` on the `selfroles` table. All the data in the column will be lost.
  - You are about to drop the column `antispam` on the `stats` table. All the data in the column will be lost.
  - You are about to drop the column `verbosity` on the `stats` table. All the data in the column will be lost.
  - The primary key for the `suggestionvotes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ended` on the `suggestionvotes` table. All the data in the column will be lost.
  - Made the column `answertype` on table `appealquestions` required. This step will fail if there are existing NULL values in that column.
  - Made the column `denybits` on table `stickypermmembers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `allowbits` on table `stickypermmembers` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `channelid` to the `suggestionvotes` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ShopType" AS ENUM ('command', 'message');

-- DropIndex
DROP INDEX "antispamsettings_guildid_key";

-- DropIndex
DROP INDEX "punish_tempbans_guildid_uniquetimestamp_userid_idx";

-- DropIndex
DROP INDEX "punish_tempmutes_guildid_uniquetimestamp_userid_idx";

-- DropIndex
DROP INDEX "guildid,channelid,msgid";

-- AlterTable
ALTER TABLE "appealquestions" DROP CONSTRAINT "appealquestions_pkey",
ALTER COLUMN "answertype" SET NOT NULL,
ALTER COLUMN "answertype" SET DEFAULT 'paragraph',
ADD CONSTRAINT "appealquestions_pkey" PRIMARY KEY ("guildid");

-- AlterTable
ALTER TABLE "appealsettings" DROP COLUMN "blusers",
ADD COLUMN     "bluserid" VARCHAR[];

-- AlterTable
ALTER TABLE "buttonroles" RENAME CONSTRAINT "rrbuttons_pkey" TO "buttonroles_pkey";

-- AlterTable
ALTER TABLE "contributers" ALTER COLUMN "roles" SET DATA TYPE VARCHAR[];

-- AlterTable
ALTER TABLE "giveawaycollection" ALTER COLUMN "requiredwinners" DROP DEFAULT;

-- AlterTable
ALTER TABLE "giveaways" ALTER COLUMN "participants" DROP DEFAULT,
ALTER COLUMN "winners" DROP DEFAULT;

-- AlterTable
ALTER TABLE "level" ALTER COLUMN "guildid" SET DEFAULT '1';

-- AlterTable
ALTER TABLE "leveling" DROP COLUMN "blchannels",
DROP COLUMN "blroles",
DROP COLUMN "blusers",
DROP COLUMN "wlchannels",
DROP COLUMN "wlroles",
DROP COLUMN "wlusers",
ADD COLUMN     "blchannelid" VARCHAR[],
ADD COLUMN     "blroleid" VARCHAR[],
ADD COLUMN     "bluserid" VARCHAR[],
ADD COLUMN     "wlchannelid" VARCHAR[],
ADD COLUMN     "wlroleid" VARCHAR[],
ADD COLUMN     "wluserid" VARCHAR[],
ALTER COLUMN "lvlupemotes" SET DEFAULT ARRAY['🆙', 'AMayakopeek:924071140257841162']::VARCHAR[];

-- AlterTable
ALTER TABLE "reactionrolesettings" DROP COLUMN "onlyone";

-- AlterTable
ALTER TABLE "reminders" DROP COLUMN "msgid";

-- AlterTable
ALTER TABLE "rolerewards" DROP COLUMN "blroles",
DROP COLUMN "blusers",
ADD COLUMN     "blroleid" VARCHAR[],
ADD COLUMN     "bluserid" VARCHAR[];

-- AlterTable
ALTER TABLE "selfroles" DROP COLUMN "blroles",
DROP COLUMN "blusers",
DROP COLUMN "wlroles",
DROP COLUMN "wlusers",
ADD COLUMN     "blroleid" VARCHAR[],
ADD COLUMN     "bluserid" VARCHAR[],
ADD COLUMN     "wlroleid" VARCHAR[],
ADD COLUMN     "wluserid" VARCHAR[];

-- AlterTable
ALTER TABLE "stats" DROP COLUMN "antispam",
DROP COLUMN "verbosity";

-- AlterTable
ALTER TABLE "sticky" RENAME CONSTRAINT "stickyroles_pkey" TO "sticky_pkey";

-- AlterTable
ALTER TABLE "stickymessages" RENAME CONSTRAINT "primary" TO "stickymessages_pkey";

-- AlterTable
ALTER TABLE "stickypermmembers" ALTER COLUMN "denybits" SET NOT NULL,
ALTER COLUMN "denybits" SET DEFAULT 0,
ALTER COLUMN "allowbits" SET NOT NULL,
ALTER COLUMN "allowbits" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "suggestionsettings" ADD COLUMN     "deleteapproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deleteapprovedafter" DECIMAL NOT NULL DEFAULT 86400,
ADD COLUMN     "deletedenied" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "deletedeniedafter" DECIMAL NOT NULL DEFAULT 86400;

-- AlterTable
ALTER TABLE "suggestionvotes" DROP CONSTRAINT "suggestionvotes_pkey",
DROP COLUMN "ended",
ADD COLUMN     "approved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "channelid" VARCHAR NOT NULL,
ADD CONSTRAINT "suggestionvotes_pkey" PRIMARY KEY ("msgid");

-- CreateTable
CREATE TABLE "customroles" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "roleid" VARCHAR NOT NULL,

    CONSTRAINT "customroles_pkey" PRIMARY KEY ("guildid","userid")
);

-- CreateTable
CREATE TABLE "shop" (
    "guildid" VARCHAR NOT NULL,
    "roles" VARCHAR[],
    "price" DECIMAL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "shoptype" "ShopType" NOT NULL DEFAULT 'command',
    "active" BOOLEAN NOT NULL DEFAULT false,
    "currencyemote" TEXT,
    "buttontext" TEXT,
    "buttonemote" TEXT,
    "msgid" VARCHAR,
    "channelid" VARCHAR,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "shopusers" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "boughtids" VARCHAR[],

    CONSTRAINT "shopusers_pkey" PRIMARY KEY ("userid","guildid")
);

-- CreateIndex
CREATE INDEX "customroles_guildid_userid_idx" ON "customroles"("guildid", "userid");

-- CreateIndex
CREATE INDEX "shop_guildid_uniquetimestamp_idx" ON "shop"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "shopusers_userid_guildid_idx" ON "shopusers"("userid", "guildid");

-- CreateIndex
CREATE INDEX "punish_tempbans_guildid_userid_idx" ON "punish_tempbans"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_tempmutes_guildid_userid_idx" ON "punish_tempmutes"("guildid", "userid");
