apt install -y gettext
envsubst < ./.env.template > ./.env
pnpm start