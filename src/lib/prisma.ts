import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
// Import the generated client directly from the repo-root output dir, NOT via
// '@prisma/client'. pnpm peer-keys multiple isolated @prisma/client instances;
// `prisma generate` populates one, this package resolves another, so the stub's
// re-export comes back empty (every enum undefined). The relative path is
// name-agnostic: dist/lib -> 4 up -> repo root -> prisma-client-generated.
const _prisma = require('../../../../prisma-client-generated');

export const Prisma = _prisma.Prisma;
export const PrismaClient = _prisma.PrismaClient;
export const FormulaType = _prisma.FormulaType;
export const TicketType = _prisma.TicketType;
export const AutoPunishPunishmentType = _prisma.AutoPunishPunishmentType;
export const PunishmentType = _prisma.PunishmentType;
export const StoredPunishmentTypes = _prisma.StoredPunishmentTypes;
export const AntiRaidPunishmentType = _prisma.AntiRaidPunishmentType;
export const AnswerType = _prisma.AnswerType;
export const LevelType = _prisma.LevelType;
export const LevelUpMode = _prisma.LevelUpMode;
export const VoteType = _prisma.VoteType;
export const ShopType = _prisma.ShopType;
export const WeekendType = _prisma.WeekendType;
export const ArtType = _prisma.ArtType;
export const AppealStatus = _prisma.AppealStatus;
export default _prisma;
