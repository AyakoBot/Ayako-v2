while [ true ]
do
node --trace-deprecation --trace-warnings --max-old-space-size=8192 --experimental-specifier-resolution=node ./dist/index.js
sleep 0s
done
exit