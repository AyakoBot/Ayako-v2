/*
  Warnings:

  - The `lvlupmode` column on the `leveling` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `auditlogevents` on the `logchannels` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LevelUpMode" AS ENUM ('message', 'react', 'silent');

-- AlterTable
ALTER TABLE "leveling" ADD COLUMN     "minwords" DECIMAL NOT NULL DEFAULT 0,
DROP COLUMN "lvlupmode",
ADD COLUMN     "lvlupmode" "LevelUpMode" NOT NULL DEFAULT 'silent';

-- AlterTable
ALTER TABLE "logchannels" DROP COLUMN "auditlogevents";

-- AlterTable
ALTER TABLE "nitrosettings" ALTER COLUMN "rolemode" SET DEFAULT true;
