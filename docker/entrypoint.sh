#!/bin/sh

env="
window.VUE_APP_URL='${WIS2BOX_URL}'\n
window.VUE_APP_OAPI='${WIS2BOX_API_URL}'\n
window.VUE_APP_MQTT='${WIS2BOX_MQTT_URL}'\n
window.VUE_APP_WAF='${WIS2BOX_URL}/data/'\n
window.VUE_APP_BASEMAP_URL='${WIS2BOX_BASEMAP_URL:-https://\{s\}.tile.openstreetmap.org/\{z\}/\{x\}/\{y\}.png}'\n
window.VUE_APP_BASEMAP_ATTRIBUTION='${WIS2BOX_BASEMAP_ATTRIBUTION:-&copy; <a href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors}'\n
"
echo $env >> /usr/share/nginx/html/env.js
