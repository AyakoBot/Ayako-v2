/*
  Warnings:

  - You are about to drop the column `usestrike` on the `blacklist` table. All the data in the column will be lost.
  - You are about to drop the `punishments_blacklist` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `maxnewlines` to the `blacklist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "blacklist" DROP COLUMN "usestrike",
ADD COLUMN     "blockinvites" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "inviteswlchannelid" VARCHAR[],
ADD COLUMN     "inviteswlroleid" VARCHAR[],
ADD COLUMN     "maxnewlines" DECIMAL NOT NULL,
ADD COLUMN     "newlineswlchannelid" VARCHAR[],
ADD COLUMN     "newlineswlroleid" VARCHAR[];

-- DropTable
DROP TABLE "punishments_blacklist";
