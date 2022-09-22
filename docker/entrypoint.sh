#!/bin/sh

env="
window.VUE_APP_OAPI='${WIS2BOX_API_URL:-http://localhost:8999/pygeoapi}'\n
window.VUE_APP_MQTT='${WIS2BOX_MQTT_URL:-mqtt://localhost:1883}'\n
window.VUE_APP_WAF='${WIS2BOX_URL:-http://localhost:8999}/data/'\n
"
echo $env >> /usr/share/nginx/html/env.js
