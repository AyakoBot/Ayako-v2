-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('paragraph', 'short', 'number', 'boolean', 'multiple_choice', 'single_choice');

-- CreateEnum
CREATE TYPE "LevelType" AS ENUM ('guild', 'global');

-- CreateEnum
CREATE TYPE "PunishmentType" AS ENUM ('warn', 'kick', 'tempmute', 'ban', 'tempban', 'channelban', 'tempchannelban');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('guild', 'bot');

-- CreateTable
CREATE TABLE "afk" (
    "userid" VARCHAR NOT NULL,
    "text" TEXT,
    "since" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,

    CONSTRAINT "afk_pkey" PRIMARY KEY ("userid","guildid")
);

-- CreateTable
CREATE TABLE "antiraid" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "posttof" BOOLEAN NOT NULL DEFAULT false,
    "postchannel" VARCHAR,
    "pingroles" VARCHAR[],
    "pingusers" VARCHAR[],
    "time" DECIMAL NOT NULL DEFAULT 15000,
    "jointhreshold" DECIMAL NOT NULL DEFAULT 10,
    "punishmenttof" BOOLEAN NOT NULL DEFAULT true,
    "punishment" "PunishmentType" NOT NULL DEFAULT 'kick',

    CONSTRAINT "antiraidsettings_pkey" PRIMARY KEY ("guildid")
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
    "usestrike" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "antispamsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "antivirus" (
    "guildid" VARCHAR NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "minimize" DECIMAL NOT NULL DEFAULT 10000,
    "delete" DECIMAL NOT NULL DEFAULT 10000,
    "linklogging" BOOLEAN NOT NULL DEFAULT false,
    "linklogchannels" VARCHAR[],
    "minimizetof" BOOLEAN NOT NULL DEFAULT true,
    "deletetof" BOOLEAN NOT NULL DEFAULT false,
    "usestrike" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "antivirus_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "appealquestions" (
    "guildid" VARCHAR NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "question" TEXT,
    "answertype" "AnswerType",
    "required" BOOLEAN NOT NULL DEFAULT true,

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
    "blusers" VARCHAR[],

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
    "duration" DECIMAL DEFAULT 3600,
    "warnamount" DECIMAL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "addroles" VARCHAR[],
    "removeroles" VARCHAR[],
    "confirmationreq" BOOLEAN NOT NULL DEFAULT false,
    "punishmentawaittime" DECIMAL NOT NULL DEFAULT 20,
    "punishment" "PunishmentType" NOT NULL DEFAULT 'warn',

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
CREATE TABLE "blacklist" (
    "active" BOOLEAN NOT NULL DEFAULT false,
    "guildid" VARCHAR NOT NULL,
    "usestrike" BOOLEAN NOT NULL DEFAULT false,
    "repostenabled" BOOLEAN NOT NULL DEFAULT false,
    "repostroles" VARCHAR[],
    "repostrules" VARCHAR[],

    CONSTRAINT "blacklists_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "buttonroles" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "roles" VARCHAR[],
    "emote" VARCHAR,
    "text" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "linkedid" VARCHAR,
    "guildid" VARCHAR NOT NULL,

    CONSTRAINT "rrbuttons_pkey" PRIMARY KEY ("uniquetimestamp")
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
    "roles" TEXT[],

    CONSTRAINT "contributers_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "cooldowns" (
    "command" TEXT,
    "cooldown" DECIMAL NOT NULL DEFAULT 10000,
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

    CONSTRAINT "guildsettings_pkey" PRIMARY KEY ("guildid")
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
    "requiredwinners" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],

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
    "participants" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
    "collecttime" DECIMAL,
    "failreroll" BOOLEAN NOT NULL DEFAULT false,
    "winners" VARCHAR[] DEFAULT ARRAY[]::VARCHAR[],
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
    "lan" TEXT NOT NULL DEFAULT 'en',
    "errorchannel" VARCHAR,
    "voterole" VARCHAR,
    "enabledrp" BOOLEAN NOT NULL DEFAULT false,
    "rpenableruns" DECIMAL NOT NULL DEFAULT 0,
    "lastrpsyncrun" DECIMAL,
    "ptreminderenabled" BOOLEAN NOT NULL DEFAULT true,
    "legacyrp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "guildsettings_pkey1" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "level" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL DEFAULT 1,
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
    "blchannels" VARCHAR[],
    "blroles" VARCHAR[],
    "blusers" VARCHAR[],
    "wlchannels" VARCHAR[],
    "wlroles" VARCHAR[],
    "wlusers" VARCHAR[],
    "xppermsg" DECIMAL NOT NULL DEFAULT 25,
    "rolemode" BOOLEAN NOT NULL DEFAULT true,
    "lvlupmode" DECIMAL NOT NULL DEFAULT 0,
    "lvlupdeltimeout" DECIMAL NOT NULL DEFAULT 10000,
    "lvlupchannels" VARCHAR[],
    "lvlupemotes" VARCHAR[] DEFAULT '{🆙,<:AMayakopeek:924071140257841162>}'::character varying[],
    "embed" DECIMAL,
    "ignoreprefixes" BOOLEAN NOT NULL DEFAULT false,
    "prefixes" TEXT[],

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
    "auditlogevents" VARCHAR[],

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
    "rolemode" BOOLEAN DEFAULT false,

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
CREATE TABLE "punishments_antispam" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "warnamount" DECIMAL,
    "punishment" "PunishmentType",
    "active" BOOLEAN NOT NULL DEFAULT false,
    "duration" DECIMAL NOT NULL DEFAULT 3600,

    CONSTRAINT "punishments_antispam_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punishments_antivirus" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "warnamount" DECIMAL,
    "punishment" "PunishmentType",
    "active" BOOLEAN NOT NULL DEFAULT false,
    "duration" DECIMAL NOT NULL DEFAULT 3600,

    CONSTRAINT "punishments_antivirus_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "punishments_blacklist" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "warnamount" DECIMAL,
    "punishment" "PunishmentType",
    "active" BOOLEAN NOT NULL DEFAULT false,
    "duration" DECIMAL NOT NULL DEFAULT 3600,

    CONSTRAINT "punishments_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "reactionroles" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "emote" VARCHAR NOT NULL,
    "roles" VARCHAR[],
    "active" BOOLEAN NOT NULL,
    "linkedid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,

    CONSTRAINT "rrreactions_pkey" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "reactionrolesettings" (
    "guildid" VARCHAR NOT NULL,
    "msgid" VARCHAR,
    "uniquetimestamp" DECIMAL NOT NULL,
    "onlyone" BOOLEAN NOT NULL DEFAULT false,
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
    "msgid" DECIMAL NOT NULL,

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
    "roleposition" DECIMAL,
    "xpmultiplier" DECIMAL,
    "currency" DECIMAL,
    "blroles" VARCHAR[],
    "blusers" VARCHAR[],
    "roles" VARCHAR,

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
    "channelid" VARCHAR,
    "messageid" VARCHAR,
    "duration" DECIMAL,
    "startat" DECIMAL,
    "index" DECIMAL,
    "length" DECIMAL,

    CONSTRAINT "roleseparatorsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "selfroles" (
    "guildid" VARCHAR NOT NULL,
    "roles" VARCHAR[],
    "onlyone" BOOLEAN NOT NULL DEFAULT false,
    "uniquetimestamp" DECIMAL NOT NULL,
    "blroles" VARCHAR[],
    "blusers" VARCHAR[],
    "wlroles" VARCHAR[],
    "wlusers" VARCHAR[],
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
    "antispam" BOOLEAN NOT NULL,
    "verbosity" BOOLEAN NOT NULL,
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

    CONSTRAINT "stickyroles_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "stickymessages" (
    "guildid" VARCHAR NOT NULL,
    "lastmsgid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "userid" VARCHAR,

    CONSTRAINT "primary" PRIMARY KEY ("channelid")
);

-- CreateTable
CREATE TABLE "stickypermmembers" (
    "userid" VARCHAR NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "channelid" VARCHAR NOT NULL,
    "denybits" BIGINT,
    "allowbits" BIGINT,

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

    CONSTRAINT "suggestionsettings_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "suggestionvotes" (
    "guildid" VARCHAR NOT NULL,
    "msgid" VARCHAR NOT NULL,
    "userid" VARCHAR NOT NULL,
    "downvoted" VARCHAR[],
    "upvoted" VARCHAR[],
    "ended" BOOLEAN NOT NULL,

    CONSTRAINT "suggestionvotes_pkey" PRIMARY KEY ("msgid","userid")
);

-- CreateTable
CREATE TABLE "users" (
    "userid" VARCHAR NOT NULL,
    "votereminders" BOOLEAN NOT NULL DEFAULT true,
    "username" TEXT NOT NULL DEFAULT 'Unkown User',
    "avatar" TEXT NOT NULL,
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
CREATE TABLE "verification" (
    "guildid" VARCHAR NOT NULL,
    "logchannel" VARCHAR,
    "finishedrole" VARCHAR,
    "pendingrole" VARCHAR,
    "startchannel" VARCHAR,
    "selfstart" BOOLEAN NOT NULL DEFAULT false,
    "kickafter" DECIMAL NOT NULL DEFAULT 600000,
    "kicktof" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("guildid")
);

-- CreateTable
CREATE TABLE "voterewards" (
    "guildid" VARCHAR NOT NULL,
    "uniquetimestamp" DECIMAL NOT NULL,
    "tier" DECIMAL,
    "linkedid" TEXT,
    "rewardroles" VARCHAR[],
    "rewardxpmultiplier" DECIMAL,
    "rewardcurrency" DECIMAL,
    "rewardxp" DECIMAL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "voterewards_pkey1" PRIMARY KEY ("uniquetimestamp")
);

-- CreateTable
CREATE TABLE "voters" (
    "userid" VARCHAR NOT NULL,
    "removetime" DECIMAL NOT NULL,
    "voted" VARCHAR NOT NULL,
    "votetype" "VoteType" NOT NULL,
    "tier" DECIMAL NOT NULL,
    "rewardroles" VARCHAR[],
    "rewardxp" DECIMAL,
    "rewardcurrency" DECIMAL,
    "rewardxpmultiplier" DECIMAL,

    CONSTRAINT "voterewards_pkey" PRIMARY KEY ("userid","voted")
);

-- CreateTable
CREATE TABLE "votesettings" (
    "uniquetimestamp" DECIMAL NOT NULL,
    "guildid" VARCHAR NOT NULL,
    "token" TEXT,
    "reminders" BOOLEAN NOT NULL DEFAULT false,
    "announcementchannel" VARCHAR,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "linkedid" TEXT,

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

-- CreateIndex
CREATE UNIQUE INDEX "antispamsettings_guildid_key" ON "antispam"("guildid");

-- CreateIndex
CREATE UNIQUE INDEX "guildid,channelid,msgid" ON "reactionrolesettings"("guildid", "channelid", "msgid");
