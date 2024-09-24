# Prequisits
### 
`screen -dmS Discord-Proxy -d -m docker run -e REQUEST_TIMEOUT=15000 -p 127.0.0.1:8080:8080 -p 127.0.0.1:9000:9000 ghcr.io/germanoeich/nirn-proxy:v1.3.3`

### 
`apt-get update && apt-get install -y libjemalloc-dev` <br />
`echo "/usr/lib/x86_64-linux-gnu/libjemalloc.so" >> /etc/ld.so.preload`

# Installation

## With Docker Compose (recommended)
[See Ayako's Monorepo](https://github.com/AyakoBot/Ayako)

## Just Ayako
### Prerequisits

- Docker
- [Postgres Database](https://www.postgresql.org/) (at 5432) ([schema](https://github.com/AyakoBot/Ayako/blob/main/prisma/schema.prisma))
- [Redis](https://redis.io/) (at 6379) (You will have to change the connection string of the [redis client](https://github.com/AyakoBot/Ayako-v2/blob/main/src/BaseClient/Cluster/Redis.ts#L21))
- [Jemalloc](https://jemalloc.net/) (optional)
- [Nirn Proxy](https://github.com/germanoeich/nirn-proxy) (optional) (If you don't want to use Nirn, you will have to change the API endpoint by going through the code and replacing `http://nirn:8080/api` with your API endpoint)

### How to run

1. Clone the repository
2. Copy the `.env.example` file to `.env` and fill in the values
3. Build and run the docker image

```bash
docker build -t Ayako .
```

```bash
docker run -d Ayako
```

# Reporting issues
[Issues tab](https://github.com/AyakoBot/Ayako-v2/issues)
