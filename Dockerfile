FROM ubuntu:latest
WORKDIR /app

RUN apt-get update && apt-get install -y libjemalloc-dev curl
RUN echo "/usr/lib/x86_64-linux-gnu/libjemalloc.so" >> /etc/ld.so.preload

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    nvm install 22 && \
    nvm use 22 && \
    corepack enable && \
    corepack prepare pnpm@latest --activate

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

COPY . /app
WORKDIR /app
COPY ./.env /app/.env

RUN export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    pnpm install

WORKDIR /app

RUN export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    pnpm build

ENV NVM_DIR="/root/.nvm"
ENV PATH="/root/.nvm/versions/node/v22.0.0/bin:$PATH"