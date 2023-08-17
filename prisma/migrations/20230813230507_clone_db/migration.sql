-- DropIndex
DROP INDEX "appealquestions_guildid_idx";

-- DropIndex
DROP INDEX "autopunish_guildid_idx";

-- DropIndex
DROP INDEX "buttonroles_guildid_idx";

-- DropIndex
DROP INDEX "buttonrolesettings_guildid_idx";

-- DropIndex
DROP INDEX "cooldowns_guildid_idx";

-- DropIndex
DROP INDEX "customembeds_guildid_idx";

-- DropIndex
DROP INDEX "levelingmultichannels_guildid_idx";

-- DropIndex
DROP INDEX "levelingmultiroles_guildid_idx";

-- DropIndex
DROP INDEX "levelingroles_guildid_idx";

-- DropIndex
DROP INDEX "levelingruleschannels_guildid_idx";

-- DropIndex
DROP INDEX "nitroroles_guildid_idx";

-- DropIndex
DROP INDEX "punish_bans_guildid_userid_idx";

-- DropIndex
DROP INDEX "punish_channelbans_guildid_userid_idx";

-- DropIndex
DROP INDEX "punish_kicks_guildid_userid_idx";

-- DropIndex
DROP INDEX "punish_mutes_guildid_userid_idx";

-- DropIndex
DROP INDEX "punish_tempbans_guildid_userid_idx";

-- DropIndex
DROP INDEX "punish_tempchannelbans_guildid_userid_idx";

-- DropIndex
DROP INDEX "punish_tempmutes_guildid_userid_idx";

-- DropIndex
DROP INDEX "punish_warns_guildid_userid_idx";

-- DropIndex
DROP INDEX "reactionroles_guildid_idx";

-- DropIndex
DROP INDEX "reactionrolesettings_guildid_idx";

-- DropIndex
DROP INDEX "reminders_userid_idx";

-- DropIndex
DROP INDEX "rolerewards_guildid_idx";

-- DropIndex
DROP INDEX "roleseparator_guildid_idx";

-- DropIndex
DROP INDEX "selfroles_guildid_idx";

-- DropIndex
DROP INDEX "voterewards_guildid_idx";

-- DropIndex
DROP INDEX "votesettings_guildid_idx";

-- CreateIndex
CREATE INDEX "appealquestions_guildid_uniquetimestamp_idx" ON "appealquestions"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "autopunish_guildid_uniquetimestamp_idx" ON "autopunish"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "buttonroles_guildid_uniquetimestamp_idx" ON "buttonroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "buttonrolesettings_guildid_uniquetimestamp_idx" ON "buttonrolesettings"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "cooldowns_guildid_uniquetimestamp_idx" ON "cooldowns"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "customembeds_guildid_uniquetimestamp_idx" ON "customembeds"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "levelingmultichannels_guildid_uniquetimestamp_idx" ON "levelingmultichannels"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "levelingmultiroles_guildid_uniquetimestamp_idx" ON "levelingmultiroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "levelingroles_guildid_uniquetimestamp_idx" ON "levelingroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "levelingruleschannels_guildid_uniquetimestamp_idx" ON "levelingruleschannels"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "nitroroles_guildid_uniquetimestamp_idx" ON "nitroroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "punish_bans_guildid_uniquetimestamp_userid_idx" ON "punish_bans"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_channelbans_guildid_uniquetimestamp_userid_idx" ON "punish_channelbans"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_kicks_guildid_uniquetimestamp_userid_idx" ON "punish_kicks"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_mutes_guildid_uniquetimestamp_userid_idx" ON "punish_mutes"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_tempbans_guildid_uniquetimestamp_userid_idx" ON "punish_tempbans"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_tempchannelbans_guildid_uniquetimestamp_userid_idx" ON "punish_tempchannelbans"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_tempmutes_guildid_uniquetimestamp_userid_idx" ON "punish_tempmutes"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_warns_guildid_uniquetimestamp_userid_idx" ON "punish_warns"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "reactionroles_guildid_uniquetimestamp_idx" ON "reactionroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "reactionrolesettings_guildid_uniquetimestamp_idx" ON "reactionrolesettings"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "reminders_userid_uniquetimestamp_idx" ON "reminders"("userid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "rolerewards_guildid_uniquetimestamp_idx" ON "rolerewards"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "roleseparator_guildid_uniquetimestamp_idx" ON "roleseparator"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "selfroles_guildid_uniquetimestamp_idx" ON "selfroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "voterewards_guildid_uniquetimestamp_idx" ON "voterewards"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "votesettings_guildid_uniquetimestamp_idx" ON "votesettings"("guildid", "uniquetimestamp");
