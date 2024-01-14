-- CreateEnum
CREATE TYPE "AutoPunishPunishmentType" AS ENUM ('warn', 'kick', 'tempmute', 'ban', 'tempban', 'channelban', 'tempchannelban', 'softban');

-- CreateEnum
CREATE TYPE "PunishmentType" AS ENUM ('warn', 'kick', 'tempmute', 'ban', 'tempban', 'channelban', 'tempchannelban', 'strike', 'softban');

-- CreateEnum
CREATE TYPE "AntiRaidPunishmentType" AS ENUM ('kick', 'ban');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('paragraph', 'short', 'number', 'boolean', 'multiple_choice', 'single_choice', 'text');

-- CreateEnum
CREATE TYPE "LevelType" AS ENUM ('guild', 'global');

-- CreateEnum
CREATE TYPE "LevelUpMode" AS ENUM ('messages', 'reactions', 'silent');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('guild', 'bot');

-- CreateEnum
CREATE TYPE "ShopType" AS ENUM ('command', 'message');

-- CreateTable
CREATE TABLE "afk" (
    "userid" VARCHAR NOT NULL,
    "text" TEXT,
    "since" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,

    CONSTRAINT "afk_pkey" PRIMARY KEY ("userid","guildid")
);

-- CreateTable
CREATE TABLE "antispam" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "wluserid" VARCHAR[],
    "wlchannelid" VARCHAR[],
    "wlroleid" VARCHAR[],
    "forcedisabled" BOOLEAN NOT NULL DEFAULT false,
    "msgthreshold" DECIMAL NOT NULL DEFAULT 10,
    "dupemsgthreshold" DECIMAL NOT NULL DEFAULT 5,
    "timeout" DECIMAL NOT NULL DEFAULT 15,
    "deletespam" BOOLEAN NOT NULL DEFAULT true,
    "action" "PunishmentType" NOT NULL DEFAULT 'warn',
    "duration" DECIMAL NOT NULL DEFAULT 3600,
    "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,

    CONSTRAINT "antispamsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "antivirus" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "linklogging" BOOLEAN NOT NULL DEFAULT false,
    "linklogchannels" VARCHAR[],
    "action" "PunishmentType" NOT NULL DEFAULT 'warn',
    "duration" DECIMAL NOT NULL DEFAULT 3600,
    "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,

    CONSTRAINT "antivirus_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "appealquestions" (
    "guildid" VARCHAR NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "question" TEXT,
    "answertype" "AnswerType" NOT NULL DEFAULT 'paragraph',
    "required" BOOLEAN NOT NULL DEFAULT true,
    "options" TEXT[],

    CONSTRAINT "appealquestions_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "appeals" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "questions" TEXT[],
    "questiontypes" TEXT[],
    "answers" TEXT[],
    "punishmentid" DECIMAL NOT NULL,

    CONSTRAINT "appeals_pkey" PRIMARY KEY ("userid","punishmentid")
);

-- CreateTable
CREATE TABLE "appealsettings" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "channelid" VARCHAR,
    "bluserid" VARCHAR[],

    CONSTRAINT "appealsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "art" (
    "userid" VARCHAR NOT NULL,
    "created" DECIMAL NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'full',
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "art_pkey" PRIMARY KEY ("created")
);

-- CreateTable
CREATE TABLE "autopunish" (
    "guildid" VARCHAR NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "duration" DECIMAL NOT NULL DEFAULT 3600,
    "warnamount" DECIMAL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "addroles" VARCHAR[],
    "removeroles" VARCHAR[],
    "punishment" "AutoPunishPunishmentType" NOT NULL DEFAULT 'warn',
    "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,

    CONSTRAINT "autopunish_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "autoroles" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "botroleid" VARCHAR[],
    "userroleid" VARCHAR[],
    "allroleid" VARCHAR[],

    CONSTRAINT "autorole_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "balance" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "balance" DECIMAL NOT NULL DEFAULT 0,

    CONSTRAINT "balance_pkey" PRIMARY KEY ("userid","guildid")
);

-- CreateTable
CREATE TABLE "censor" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "guildid" VARCHAR NOT NULL,
    "repostroles" VARCHAR[],
    "repostrules" VARCHAR[],

    CONSTRAINT "censor_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "customroles" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "roleid" VARCHAR NOT NULL,

    CONSTRAINT "customroles_pkey" PRIMARY KEY ("guildid","userid")
);

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
    "wlroleid" VARCHAR[],
    "wlchannelid" VARCHAR[],
    "action" "PunishmentType" NOT NULL DEFAULT 'warn',
    "duration" DECIMAL NOT NULL DEFAULT 3600,
    "deletemessageseconds" DECIMAL NOT NULL DEFAULT 604800,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "buttonroles" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "roles" VARCHAR[],
    "emote" VARCHAR,
    "text" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "linkedid" DECIMAL,
    "guildid" VARCHAR NOT NULL,

    CONSTRAINT "buttonroles_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "buttonrolesettings" (
    "guildid" VARCHAR NOT NULL,
    "msgid" VARCHAR,
    "channelid" VARCHAR,
    "uniquetimestamp" DECIMAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "anyroles" VARCHAR[],
    "onlyone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "buttonrolesettings_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "contributers" (
    "userid" VARCHAR NOT NULL,
    "roles" VARCHAR[],

    CONSTRAINT "contributers_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "cooldowns" (
    "command" TEXT,
    "cooldown" DECIMAL NOT NULL DEFAULT 10,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "wlchannelid" VARCHAR[],
    "wlroleid" VARCHAR[],
    "wluserid" VARCHAR[],
    "activechannelid" VARCHAR[],
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,

    CONSTRAINT "cooldowns_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "customembeds" (
    "color" TEXT,
    "title" TEXT,
    "url" TEXT,
    "authorname" TEXT,
    "authoriconurl" TEXT,
    "authorurl" TEXT,
    "description" TEXT,
    "thumbnail" TEXT,
    "fieldnames" TEXT[],
    "fieldvalues" TEXT[],
    "fieldinlines" BOOLEAN[],
    "image" TEXT,
    "footertext" TEXT,
    "footericonurl" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "name" TEXT NOT NULL,
    "timestamp" TEXT,

    CONSTRAINT "customembeds_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "disboard" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "nextbump" DECIMAL,
    "channelid" VARCHAR,
    "repeatreminder" DECIMAL NOT NULL DEFAULT 600,
    "roles" VARCHAR[],
    "users" VARCHAR[],
    "tempchannelid" VARCHAR,
    "deletereply" BOOLEAN NOT NULL DEFAULT false,
    "msgid" VARCHAR,
    "repeatenabled" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "disboard_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "expiry" (
    "guildid" VARCHAR NOT NULL,
    "bans" BOOLEAN NOT NULL DEFAULT false,
    "channelbans" BOOLEAN NOT NULL DEFAULT false,
    "kicks" BOOLEAN NOT NULL DEFAULT false,
    "mutes" BOOLEAN NOT NULL DEFAULT false,
    "warns" BOOLEAN NOT NULL DEFAULT false,
    "banstime" DECIMAL,
    "channelbanstime" DECIMAL,
    "kickstime" DECIMAL,
    "mutestime" DECIMAL,
    "warnstime" DECIMAL,

    CONSTRAINT "modsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "filterscraper" (
    "keyword" TEXT NOT NULL,
    "filtertype" DECIMAL NOT NULL,

    CONSTRAINT "filterscraper_pkey" PRIMARY KEY ("keyword","filtertype")
);

-- CreateTable
CREATE TABLE "giveawaycollection" (
    "msgid" VARCHAR NOT NULL,
    "endtime" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "replymsgid" VARCHAR NOT NULL,
    "requiredwinners" VARCHAR[],

    CONSTRAINT "giveawaycollection_pkey" PRIMARY KEY ("msgid")
);

-- CreateTable
CREATE TABLE "giveaways" (
    "guildid" VARCHAR NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "winnercount" DECIMAL NOT NULL,
    "endtime" DECIMAL NOT NULL,
    "reqrole" VARCHAR,
    "actualprize" TEXT,
    "host" VARCHAR NOT NULL,
    "ended" BOOLEAN NOT NULL DEFAULT false,
    "channelid" VARCHAR NOT NULL,
    "participants" VARCHAR[],
    "collecttime" DECIMAL,
    "failreroll" BOOLEAN NOT NULL DEFAULT false,
    "winners" VARCHAR[],
    "claimingdone" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "giveaways_pkey" PRIMARY KEY ("msgid")
);

-- CreateTable
CREATE TABLE "guilds" (
    "guildid" VARCHAR NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "banner" TEXT,
    "invite" TEXT,
    "membercount" DECIMAL NOT NULL DEFAULT 2,

    CONSTRAINT "guilds_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "guildsettings" (
    "guildid" VARCHAR NOT NULL,
    "prefix" TEXT,
    "interactionsmode" BOOLEAN NOT NULL DEFAULT true,
    "editrpcommands" BOOLEAN NOT NULL DEFAULT true,
    "lan" TEXT NOT NULL DEFAULT 'en-GB',
    "errorchannel" VARCHAR,
    "statuschannel" VARCHAR,
    "updateschannel" TEXT,
    "enabledrp" BOOLEAN NOT NULL DEFAULT false,
    "rpenableruns" DECIMAL NOT NULL DEFAULT 0,
    "lastrpsyncrun" DECIMAL,
    "ptreminderenabled" BOOLEAN NOT NULL DEFAULT true,
    "legacyrp" BOOLEAN NOT NULL DEFAULT false,
    "token" VARCHAR,
    "publickey" TEXT,
    "appid" VARCHAR,
    "enableinvitesat" DECIMAL,

    CONSTRAINT "guildsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "level" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL DEFAULT '1',
    "type" "LevelType" NOT NULL,
    "xp" DECIMAL NOT NULL DEFAULT 0,
    "level" DECIMAL NOT NULL DEFAULT 0,
    "multiplier" DECIMAL NOT NULL DEFAULT 1,

    CONSTRAINT "level_pkey" PRIMARY KEY ("userid","guildid","type")
);

-- CreateTable
CREATE TABLE "leveling" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "xpmultiplier" DECIMAL NOT NULL DEFAULT 1,
    "blchannelid" VARCHAR[],
    "blroleid" VARCHAR[],
    "bluserid" VARCHAR[],
    "wlchannelid" VARCHAR[],
    "wlroleid" VARCHAR[],
    "wluserid" VARCHAR[],
    "xppermsg" DECIMAL NOT NULL DEFAULT 25,
    "rolemode" BOOLEAN NOT NULL DEFAULT false,
    "lvlupmode" "LevelUpMode" NOT NULL DEFAULT 'silent',
    "lvlupdeltimeout" DECIMAL NOT NULL DEFAULT 10,
    "lvlupchannels" VARCHAR[],
    "lvlupemotes" VARCHAR[] DEFAULT ARRAY['🆙', 'AMayakopeek:924071140257841162']::VARCHAR[],
    "embed" DECIMAL,
    "ignoreprefixes" BOOLEAN NOT NULL DEFAULT false,
    "prefixes" TEXT[],
    "minwords" DECIMAL NOT NULL DEFAULT 0,

    CONSTRAINT "leveling_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "levelingmultichannels" (
    "guildid" VARCHAR NOT NULL,
    "channels" VARCHAR[],
    "multiplier" DECIMAL NOT NULL DEFAULT 1,
    "uniquetimestamp" DECIMAL NOT NULL,

    CONSTRAINT "levelingmultiplierchannels_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "levelingmultiroles" (
    "guildid" VARCHAR NOT NULL,
    "roles" VARCHAR[],
    "multiplier" DECIMAL,
    "uniquetimestamp" DECIMAL NOT NULL,

    CONSTRAINT "levelingmultiplierroles_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "levelingroles" (
    "guildid" VARCHAR NOT NULL,
    "level" DECIMAL,
    "roles" VARCHAR[],
    "uniquetimestamp" DECIMAL NOT NULL,

    CONSTRAINT "levelingroles_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "levelingruleschannels" (
    "guildid" VARCHAR NOT NULL,
    "channels" VARCHAR[],
    "uniquetimestamp" DECIMAL NOT NULL,
    "hasleastattachments" DECIMAL,
    "hasmostattachments" DECIMAL,
    "hasleastcharacters" DECIMAL,
    "hasmostcharacters" DECIMAL,
    "hasleastwords" DECIMAL,
    "hasmostwords" DECIMAL,
    "mentionsleastusers" DECIMAL,
    "mentionsmostusers" DECIMAL,
    "mentionsleastchannels" DECIMAL,
    "mentionsmostchannels" DECIMAL,
    "mentionsleastroles" DECIMAL,
    "mentionsmostroles" DECIMAL,
    "hasleastlinks" DECIMAL,
    "hasmostlinks" DECIMAL,
    "hasleastemotes" DECIMAL,
    "hasmostemotes" DECIMAL,
    "hasleastmentions" DECIMAL,
    "hasmostmentions" DECIMAL,

    CONSTRAINT "levelingruleschannels_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "logchannels" (
    "guildid" VARCHAR NOT NULL,
    "applicationevents" VARCHAR[],
    "automodevents" VARCHAR[],
    "channelevents" VARCHAR[],
    "emojievents" VARCHAR[],
    "guildevents" VARCHAR[],
    "scheduledeventevents" VARCHAR[],
    "inviteevents" VARCHAR[],
    "messageevents" VARCHAR[],
    "roleevents" VARCHAR[],
    "stageevents" VARCHAR[],
    "stickerevents" VARCHAR[],
    "typingevents" VARCHAR[],
    "userevents" VARCHAR[],
    "voiceevents" VARCHAR[],
    "webhookevents" VARCHAR[],
    "settingslog" VARCHAR[],
    "modlog" VARCHAR[],
    "reactionevents" VARCHAR[],
    "memberevents" VARCHAR[],

    CONSTRAINT "logchannels_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "nitroroles" (
    "guildid" VARCHAR NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "roles" VARCHAR[],
    "days" DECIMAL,

    CONSTRAINT "nitroroles_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "nitrosettings" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "logchannels" VARCHAR[],
    "rolemode" BOOLEAN NOT NULL DEFAULT true,
    "notification" BOOLEAN NOT NULL DEFAULT false,
    "notifchannels" VARCHAR[],
    "notifembed" DECIMAL,

    CONSTRAINT "nitrosettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "nitrousers" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "booststart" DECIMAL NOT NULL,
    "boostend" DECIMAL,

    CONSTRAINT "nitrousers_pkey" PRIMARY KEY ("booststart")
);

-- CreateTable
CREATE TABLE "punish_bans" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "duration" DECIMAL,
    "msgid" VARCHAR NOT NULL,

    CONSTRAINT "mutes_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punish_channelbans" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "banchannelid" VARCHAR NOT NULL,
    "duration" DECIMAL,

    CONSTRAINT "punish_channelban_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punish_kicks" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "msgid" VARCHAR NOT NULL,

    CONSTRAINT "punish_kicks_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punish_mutes" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "duration" DECIMAL,

    CONSTRAINT "punish_mutes_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punish_tempbans" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "duration" DECIMAL NOT NULL,

    CONSTRAINT "punish_tempbans_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punish_tempchannelbans" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "banchannelid" VARCHAR NOT NULL,
    "duration" DECIMAL NOT NULL,

    CONSTRAINT "punish_tempchannelban_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punish_tempmutes" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "duration" DECIMAL NOT NULL,

    CONSTRAINT "punish_tempmutes_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punish_warns" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "reason" TEXT,
    "uniquetimestamp" DECIMAL NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "channelname" TEXT NOT NULL,
    "executorid" VARCHAR NOT NULL,
    "executorname" TEXT NOT NULL,
    "msgid" VARCHAR NOT NULL,

    CONSTRAINT "punish_warns_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "reactionroles" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "emote" VARCHAR,
    "roles" VARCHAR[],
    "active" BOOLEAN NOT NULL DEFAULT false,
    "linkedid" DECIMAL,
    "guildid" VARCHAR NOT NULL,

    CONSTRAINT "rrreactions_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "reactionrolesettings" (
    "guildid" VARCHAR NOT NULL,
    "msgid" VARCHAR,
    "uniquetimestamp" DECIMAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "anyroles" VARCHAR[],
    "channelid" VARCHAR,

    CONSTRAINT "rrsettings_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "reminders" (
    "userid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "reason" TEXT NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "endtime" DECIMAL NOT NULL,

    CONSTRAINT "reminders_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "reviews" (
    "userid" VARCHAR NOT NULL,
    "score" DECIMAL NOT NULL DEFAULT 1,
    "username" TEXT NOT NULL,
    "avatar" TEXT,
    "content" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "rolerewards" (
    "guildid" VARCHAR NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "customrole" BOOLEAN NOT NULL DEFAULT false,
    "positionrole" TEXT,
    "xpmultiplier" DECIMAL,
    "currency" DECIMAL,
    "blroleid" VARCHAR[],
    "bluserid" VARCHAR[],
    "roles" VARCHAR[],
    "cansetcolor" BOOLEAN NOT NULL DEFAULT true,
    "canseticon" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "rolerewards_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "roleseparator" (
    "guildid" VARCHAR NOT NULL,
    "separator" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "stoprole" VARCHAR,
    "isvarying" BOOLEAN NOT NULL DEFAULT false,
    "roles" VARCHAR[],
    "uniquetimestamp" DECIMAL NOT NULL,

    CONSTRAINT "roleseparator_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "roleseparatorsettings" (
    "guildid" VARCHAR NOT NULL,
    "stillrunning" BOOLEAN NOT NULL,
    "duration" DECIMAL,
    "startat" DECIMAL,
    "index" DECIMAL,
    "length" DECIMAL,
    "channelid" VARCHAR,
    "messageid" VARCHAR,

    CONSTRAINT "roleseparatorsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "selfroles" (
    "guildid" VARCHAR NOT NULL,
    "roles" VARCHAR[],
    "onlyone" BOOLEAN NOT NULL DEFAULT false,
    "uniquetimestamp" DECIMAL NOT NULL,
    "blroleid" VARCHAR[],
    "bluserid" VARCHAR[],
    "wlroleid" VARCHAR[],
    "wluserid" VARCHAR[],
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL DEFAULT 'Change me',

    CONSTRAINT "selfroles_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "stats" (
    "usercount" DECIMAL NOT NULL,
    "guildcount" DECIMAL NOT NULL,
    "channelcount" DECIMAL NOT NULL,
    "rolecount" DECIMAL NOT NULL,
    "allusers" DECIMAL NOT NULL,
    "willis" TEXT[],
    "heartbeat" DECIMAL NOT NULL,

    CONSTRAINT "stats_pkey" PRIMARY KEY ("usercount")
);

-- CreateTable
CREATE TABLE "sticky" (
    "guildid" VARCHAR NOT NULL,
    "roles" VARCHAR[],
    "stickyrolesmode" BOOLEAN NOT NULL DEFAULT true,
    "stickyrolesactive" BOOLEAN NOT NULL DEFAULT false,
    "stickypermsactive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "sticky_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "stickymessages" (
    "guildid" VARCHAR NOT NULL,
    "lastmsgid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,

    CONSTRAINT "stickymessages_pkey" PRIMARY KEY ("channelid")
);

-- CreateTable
CREATE TABLE "stickypermmembers" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "denybits" BIGINT NOT NULL DEFAULT 0,
    "allowbits" BIGINT NOT NULL DEFAULT 0,

    CONSTRAINT "stickypermmembers_pkey" PRIMARY KEY ("userid","channelid")
);

-- CreateTable
CREATE TABLE "stickyrolemembers" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "roles" VARCHAR[],

    CONSTRAINT "stickyrolemembers_pkey" PRIMARY KEY ("userid","guildid")
);

-- CreateTable
CREATE TABLE "suggestionsettings" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "channelid" VARCHAR,
    "novoteroles" VARCHAR[],
    "novoteusers" VARCHAR[],
    "approverroleid" VARCHAR[],
    "anonvote" BOOLEAN NOT NULL DEFAULT false,
    "nosendroles" VARCHAR[],
    "nosendusers" VARCHAR[],
    "anonsuggestion" BOOLEAN NOT NULL DEFAULT false,
    "pingroleid" VARCHAR[],
    "pinguserid" VARCHAR[],
    "deletedenied" BOOLEAN NOT NULL DEFAULT false,
    "deleteapproved" BOOLEAN NOT NULL DEFAULT false,
    "deletedeniedafter" DECIMAL NOT NULL DEFAULT 86400,
    "deleteapprovedafter" DECIMAL NOT NULL DEFAULT 86400,

    CONSTRAINT "suggestionsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "suggestionvotes" (
    "guildid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "downvoted" VARCHAR[],
    "upvoted" VARCHAR[],
    "approved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "suggestionvotes_pkey" PRIMARY KEY ("msgid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" VARCHAR NOT NULL,
    "username" TEXT NOT NULL DEFAULT 'Unkown User',
    "avatar" TEXT NOT NULL DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    "socials" TEXT[],
    "socialstype" TEXT[],
    "lastfetch" DECIMAL NOT NULL DEFAULT 1,
    "email" TEXT,
    "refreshtoken" TEXT,
    "expires" DECIMAL,
    "accesstoken" TEXT,
    "ptremindersent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "blockedusers" (
    "userid" VARCHAR NOT NULL,
    "blockeduserid" VARCHAR NOT NULL,
    "blockedcmd" TEXT[],

    CONSTRAINT "blockedusers_pkey" PRIMARY KEY ("userid","blockeduserid")
);

-- CreateTable
CREATE TABLE "verification" (
    "guildid" VARCHAR NOT NULL,
    "logchannel" VARCHAR,
    "finishedrole" VARCHAR,
    "pendingrole" VARCHAR,
    "startchannel" VARCHAR,
    "selfstart" BOOLEAN NOT NULL DEFAULT false,
    "kickafter" DECIMAL NOT NULL DEFAULT 600,
    "kicktof" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "voterewards" (
    "guildid" VARCHAR NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "tier" DECIMAL,
    "linkedid" DECIMAL,
    "rewardroles" VARCHAR[],
    "rewardxpmultiplier" DECIMAL,
    "rewardcurrency" DECIMAL,
    "rewardxp" DECIMAL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "voterewards_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "votes" (
    "guildid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "endtime" DECIMAL NOT NULL,
    "votetype" "VoteType" NOT NULL,
    "voted" VARCHAR NOT NULL,
    "relatedsetting" DECIMAL NOT NULL,

    CONSTRAINT "votes_pkey" PRIMARY KEY ("guildid","userid","voted")
);

-- CreateTable
CREATE TABLE "votesappliedrewards" (
    "voted" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "rewardroles" VARCHAR[],
    "rewardxp" DECIMAL,
    "rewardcurrency" DECIMAL,
    "rewardxpmultiplier" DECIMAL,
    "relatedvote" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "voters_pkey" PRIMARY KEY ("userid","voted")
);

-- CreateTable
CREATE TABLE "votesettings" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "token" TEXT,
    "reminders" BOOLEAN NOT NULL DEFAULT false,
    "announcementchannel" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "linkedid" DECIMAL,

    CONSTRAINT "votesettings_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "welcome" (
    "guildid" VARCHAR NOT NULL,
    "channelid" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "embed" DECIMAL,
    "pingroles" VARCHAR[],
    "pingusers" VARCHAR[],
    "pingjoin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "welcome_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "deletethreads" (
    "guildid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "deletetime" DECIMAL NOT NULL,

    CONSTRAINT "deletethreads_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "shop" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "currencyemote" TEXT,

    CONSTRAINT "shop_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "shopitems" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "roles" VARCHAR[],
    "price" DECIMAL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "shoptype" "ShopType" NOT NULL DEFAULT 'command',
    "buttontext" TEXT,
    "buttonemote" TEXT,
    "msgid" VARCHAR,
    "channelid" VARCHAR,

    CONSTRAINT "shopitems_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "shopusers" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "boughtids" VARCHAR[],

    CONSTRAINT "shopusers_pkey" PRIMARY KEY ("userid","guildid")
);

-- CreateTable
CREATE TABLE "voicehubs" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "channelid" VARCHAR,
    "categoryid" VARCHAR,
    "deletetime" DECIMAL NOT NULL DEFAULT 3600,
    "blroleid" VARCHAR[],
    "bluserid" VARCHAR[],
    "wlroleid" VARCHAR[],
    "wluserid" VARCHAR[],

    CONSTRAINT "voicehubs_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "voicechannels" (
    "ownerid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "hubid" VARCHAR NOT NULL,
    "everyonelefttime" DECIMAL,

    CONSTRAINT "voicechannels_pkey" PRIMARY KEY ("guildid","channelid")
);

-- CreateTable
CREATE TABLE "antiraid" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "posttof" BOOLEAN NOT NULL DEFAULT false,
    "postchannels" VARCHAR[],
    "pingroles" VARCHAR[],
    "pingusers" VARCHAR[],
    "timeout" DECIMAL NOT NULL DEFAULT 15,
    "jointhreshold" DECIMAL NOT NULL DEFAULT 5,
    "actiontof" BOOLEAN NOT NULL DEFAULT true,
    "action" "AntiRaidPunishmentType" NOT NULL DEFAULT 'kick',
    "disableinvites" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "antiraid_pkey" PRIMARY KEY ("guildid")
);

-- CreateIndex
CREATE INDEX "afk_userid_guildid_idx" ON "afk"("userid", "guildid");

-- CreateIndex
CREATE INDEX "antispam_guildid_idx" ON "antispam"("guildid");

-- CreateIndex
CREATE INDEX "antivirus_guildid_idx" ON "antivirus"("guildid");

-- CreateIndex
CREATE INDEX "appealquestions_guildid_uniquetimestamp_idx" ON "appealquestions"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "appeals_userid_punishmentid_idx" ON "appeals"("userid", "punishmentid");

-- CreateIndex
CREATE INDEX "appealsettings_guildid_idx" ON "appealsettings"("guildid");

-- CreateIndex
CREATE INDEX "art_created_idx" ON "art"("created");

-- CreateIndex
CREATE INDEX "autopunish_guildid_uniquetimestamp_idx" ON "autopunish"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "autoroles_guildid_idx" ON "autoroles"("guildid");

-- CreateIndex
CREATE INDEX "balance_userid_guildid_idx" ON "balance"("userid", "guildid");

-- CreateIndex
CREATE INDEX "censor_guildid_idx" ON "censor"("guildid");

-- CreateIndex
CREATE INDEX "customroles_guildid_userid_idx" ON "customroles"("guildid", "userid");

-- CreateIndex
CREATE INDEX "newlines_guildid_idx" ON "newlines"("guildid");

-- CreateIndex
CREATE INDEX "invites_guildid_idx" ON "invites"("guildid");

-- CreateIndex
CREATE INDEX "buttonroles_guildid_uniquetimestamp_idx" ON "buttonroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "buttonrolesettings_guildid_uniquetimestamp_idx" ON "buttonrolesettings"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "cooldowns_guildid_uniquetimestamp_idx" ON "cooldowns"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "customembeds_guildid_uniquetimestamp_idx" ON "customembeds"("guildid", "uniquetimestamp");

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
CREATE INDEX "levelingmultichannels_guildid_uniquetimestamp_idx" ON "levelingmultichannels"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "levelingmultiroles_guildid_uniquetimestamp_idx" ON "levelingmultiroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "levelingroles_guildid_uniquetimestamp_idx" ON "levelingroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "levelingruleschannels_guildid_uniquetimestamp_idx" ON "levelingruleschannels"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "logchannels_guildid_idx" ON "logchannels"("guildid");

-- CreateIndex
CREATE INDEX "nitroroles_guildid_uniquetimestamp_idx" ON "nitroroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "nitrosettings_guildid_idx" ON "nitrosettings"("guildid");

-- CreateIndex
CREATE INDEX "nitrousers_guildid_idx" ON "nitrousers"("guildid");

-- CreateIndex
CREATE INDEX "punish_bans_guildid_uniquetimestamp_userid_idx" ON "punish_bans"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_channelbans_guildid_uniquetimestamp_userid_idx" ON "punish_channelbans"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_kicks_guildid_uniquetimestamp_userid_idx" ON "punish_kicks"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_mutes_guildid_uniquetimestamp_userid_idx" ON "punish_mutes"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_tempbans_guildid_userid_idx" ON "punish_tempbans"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_tempchannelbans_guildid_uniquetimestamp_userid_idx" ON "punish_tempchannelbans"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "punish_tempmutes_guildid_userid_idx" ON "punish_tempmutes"("guildid", "userid");

-- CreateIndex
CREATE INDEX "punish_warns_guildid_uniquetimestamp_userid_idx" ON "punish_warns"("guildid", "uniquetimestamp", "userid");

-- CreateIndex
CREATE INDEX "reactionroles_guildid_uniquetimestamp_idx" ON "reactionroles"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "reactionrolesettings_guildid_uniquetimestamp_idx" ON "reactionrolesettings"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "reminders_userid_uniquetimestamp_idx" ON "reminders"("userid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "reviews_userid_idx" ON "reviews"("userid");

-- CreateIndex
CREATE INDEX "rolerewards_guildid_uniquetimestamp_idx" ON "rolerewards"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "roleseparator_guildid_uniquetimestamp_idx" ON "roleseparator"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "roleseparatorsettings_guildid_idx" ON "roleseparatorsettings"("guildid");

-- CreateIndex
CREATE INDEX "selfroles_guildid_uniquetimestamp_idx" ON "selfroles"("guildid", "uniquetimestamp");

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
CREATE INDEX "blockedusers_userid_idx" ON "blockedusers"("userid");

-- CreateIndex
CREATE INDEX "verification_guildid_idx" ON "verification"("guildid");

-- CreateIndex
CREATE INDEX "voterewards_guildid_uniquetimestamp_idx" ON "voterewards"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE UNIQUE INDEX "votes_endtime_key" ON "votes"("endtime");

-- CreateIndex
CREATE INDEX "votes_guildid_idx" ON "votes"("guildid");

-- CreateIndex
CREATE INDEX "votesappliedrewards_relatedvote_idx" ON "votesappliedrewards"("relatedvote");

-- CreateIndex
CREATE INDEX "votesettings_guildid_uniquetimestamp_idx" ON "votesettings"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "welcome_guildid_idx" ON "welcome"("guildid");

-- CreateIndex
CREATE INDEX "deletethreads_guildid_idx" ON "deletethreads"("guildid");

-- CreateIndex
CREATE INDEX "shop_guildid_idx" ON "shop"("guildid");

-- CreateIndex
CREATE INDEX "shopitems_guildid_uniquetimestamp_idx" ON "shopitems"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "shopusers_userid_guildid_idx" ON "shopusers"("userid", "guildid");

-- CreateIndex
CREATE INDEX "voicehubs_guildid_uniquetimestamp_idx" ON "voicehubs"("guildid", "uniquetimestamp");

-- CreateIndex
CREATE INDEX "voicechannels_guildid_channelid_idx" ON "voicechannels"("guildid", "channelid");

-- CreateIndex
CREATE INDEX "antiraid_guildid_idx" ON "antiraid"("guildid");

-- AddForeignKey
ALTER TABLE "votesappliedrewards" ADD CONSTRAINT "votesappliedrewards_relatedvote_fkey" FOREIGN KEY ("relatedvote") REFERENCES "votes"("endtime") ON DELETE RESTRICT ON UPDATE CASCADE;
