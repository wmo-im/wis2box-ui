#!/bin/sh

env="
window.VUE_APP_OAPI='${WIS2BOX_API_URL:-http://localhost:8999/pygeoapi}'\n
window.VUE_APP_MQTT='${WIS2BOX_MQTT_URL:-mqtt://localhost:1883}'\n
window.VUE_APP_WAF='${WIS2BOX_URL:-http://localhost:8999}/data/'\n
window.VUE_APP_BASEMAP_URL='${WIS2BOX_BASEMAP_URL:-https://\{s\}.tile.openstreetmap.org/\{z\}/\{x\}/\{y\}.png}'\n
window.VUE_APP_BASEMAP_ATTRIBUTION='${WIS2BOX_BASEMAP_ATTRIBUTION:-&copy; <a href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors}'\n
"
echo $env >> /usr/share/nginx/html/env.js
