FROM node:22
WORKDIR /app
RUN corepack enable
COPY . .
WORKDIR /app/packages/Bot
RUN pnpm install
RUN pnpx prisma generate
RUN pnpm build
COPY ./packages/Bot/.env /app/packages/Bot/.env.template