FROM node:23.1.0-slim as ui-builder

RUN mkdir /usr/src/app
RUN echo "deb http://archive.debian.org/debian stretch main" > /etc/apt/sources.list \
    && apt-get -y update \
    && apt-get -y upgrade \
    && apt-get install -y chromium

ENV PATH /usr/src/app/node_modules/.bin:$PATH
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY package.json /usr/src/app/package.json

WORKDIR /usr/src/app

RUN npm install --legacy-peer-deps && \
    npm install -g @vue/cli

COPY . /usr/src/app

RUN npm run postinstall && \
    npm run build && \
    mkdir /tmp/app && \
    cp -rp /usr/src/app/dist /tmp/app && \
    rm -fr /usr/src/app

FROM nginx

COPY ./docker/entrypoint.sh /docker-entrypoint.d/entrypoint.sh
RUN chmod +x /docker-entrypoint.d/entrypoint.sh

COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY  --from=ui-builder /tmp/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
