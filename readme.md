https://github.com/germanoeich/nirn-proxy
screen -dmS Discord-Proxy -d -m docker run -e REQUEST_TIMEOUT=15000 -p 8080:8080 -p 9000:9000 ghcr.io/germanoeich/nirn-proxy:v1.3.3