/*
  Warnings:

  - The `linkedid` column on the `buttonroles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `linkedid` column on the `reactionroles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `roleposition` on the `rolerewards` table. All the data in the column will be lost.
  - The `linkedid` column on the `voterewards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `guildid` to the `voters` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "buttonroles" DROP COLUMN "linkedid",
ADD COLUMN     "linkedid" DECIMAL;

-- AlterTable
ALTER TABLE "reactionroles" DROP COLUMN "linkedid",
ADD COLUMN     "linkedid" DECIMAL;

-- AlterTable
ALTER TABLE "rolerewards" DROP COLUMN "roleposition",
ADD COLUMN     "cansetcolor" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "canseticon" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "positionrole" TEXT;

-- AlterTable
ALTER TABLE "voterewards" DROP COLUMN "linkedid",
ADD COLUMN     "linkedid" DECIMAL;

-- AlterTable
ALTER TABLE "voters" ADD COLUMN     "guildid" VARCHAR NOT NULL;
