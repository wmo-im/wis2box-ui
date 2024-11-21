#!/bin/sh

# if essential env vars are not set then error
if [ -z "$WIS2BOX_API_URL" ]; then
    echo "env var 'WIS2BOX_API_URL' is not set. Set this to connect to the wis2box backend"
    exit 1
fi

# Apply env var overrides
env="window.VUE_APP_URL='${WIS2BOX_URL}'
window.VUE_APP_OAPI='${WIS2BOX_API_URL}'
window.VUE_APP_WAF='${WIS2BOX_URL}/data/'
window.VUE_APP_BASEMAP_URL='${WIS2BOX_BASEMAP_URL:-https://\{s\}.tile.openstreetmap.org/\{z\}/\{x\}/\{y\}.png}'
window.VUE_APP_BASEMAP_ATTRIBUTION='${WIS2BOX_BASEMAP_ATTRIBUTION:-&copy; <a href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors}'
window.VUE_APP_CLUSTER=${WIS2BOX_UI_CLUSTER:-false}
window.VUE_APP_LANG='${WIS2BOX_UI_LANG:-en}'"

echo "$env" > /usr/share/nginx/html/env.js
