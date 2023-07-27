/*
  Warnings:

  - The `roles` column on the `rolerewards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `userid` on table `stickymessages` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "leveling" ALTER COLUMN "lvlupemotes" SET DEFAULT '{🆙,AMayakopeek:924071140257841162}'::character varying[];

-- AlterTable
ALTER TABLE "reactionroles" ALTER COLUMN "emote" DROP NOT NULL,
ALTER COLUMN "active" SET DEFAULT false,
ALTER COLUMN "linkedid" DROP NOT NULL;

-- AlterTable
ALTER TABLE "rolerewards" DROP COLUMN "roles",
ADD COLUMN     "roles" VARCHAR[];

-- AlterTable
ALTER TABLE "stickymessages" ALTER COLUMN "userid" SET NOT NULL;
