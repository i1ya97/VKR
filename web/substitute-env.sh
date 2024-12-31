#!/bin/bash
ENV_CONFIG=${ENV_CONFIG:-'env-config.js'}

#replace environment variables
rm -rf $ENV_CONFIG
touch $ENV_CONFIG
envs=$(printenv)
echo "window._env_ = {" >>$ENV_CONFIG
for line in $envs; do
    if [[ $line == *"WEB_"* ]]; then
        if printf '%s\n' "$line" | grep -q -e '='; then
            varname=$(printf '%s\n' "$line" | sed -e 's/=.*//')
            varname=$(printf '%s\n' "$varname" | sed 's/WEB_//')
            varvalue=$(printf '%s\n' "$line" | sed -e 's/^[^=]*=//')
            echo $varname=$varvalue
            echo "  $varname: \"$varvalue\"," >>$ENV_CONFIG
        fi
    fi
done
echo "}" >>$ENV_CONFIG

exec "$@"
