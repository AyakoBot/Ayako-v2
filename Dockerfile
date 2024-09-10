FROM node:22
RUN corepack enable
COPY . /app

RUN apt-get update && apt-get install -y libjemalloc-dev
RUN echo "/usr/lib/x86_64-linux-gnu/libjemalloc.so" >> /etc/ld.so.preload

RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
ENV PKG_CONFIG_PATH=/usr/lib/x86_64-linux-gnu/pkgconfig

WORKDIR /app
COPY ./.env /app/packages/Bot/.env
RUN pnpm install

WORKDIR /app/packages/Bot
RUN pnpm build