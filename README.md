# wis2box-ui

`wis2box-ui` is the user interface for the [wis2box](https://docs.wis2box.wis.wmo.int) 

## Environment Variables

The UI has a series of environment variables that can be used to configure the application. If you are using `npm` locally, these can be set in the [.env](./public/env.js) file.

If you are using Docker, when you run the associated [Dockerfile](./Dockerfile), the environment variables will be loaded in and override the values in the [.env](./public/env.js) file.

| Environment Variable            | Description                                                                 | Required to be set|
|----------------------------------|-----------------------------------------------------------------------------|----------|
| `WIS2BOX_URL`                    | The base URL for the `wis2box` application.                                 | ✅    |
| `WIS2BOX_API_URL`                | The backend URL for the `wis2box` API.                                      | ✅    |
| `WIS2BOX_BASEMAP_URL`            | The URL pattern for fetching map tiles (default: OpenStreetMap URL).         | ❌    |
| `WIS2BOX_BASEMAP_ATTRIBUTION`    | Attribution text for the map tiles (default: OpenStreetMap link).            | ❌    |
| `WIS2BOX_UI_CLUSTER`             | Boolean flag to enable or disable clustering of stations on the map (default: 'false'). | ❌    |
| `WIS2BOX_UI_LANG`                | The language to use when translating with i18n (default: 'en').              | ❌    |
| `WIS2BOX_UI_LOGO`                   | The URL of a custom logo to display in the application.                      | ❌    |
| `WIS2BOX_UI_BANNER_COLOR`| The background color of the banner (can be set to a hex color code).         | ❌    |
| `WIS2BOX_UI_DISABLE_SEPARATOR_IMAGE`| Boolean flag to enable or disable the footer separator image (default: 'false'). | ❌    |


## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Preview production build

```
npm run preview
```

### Run unit tests

```
npm run test:unit
```

### Lints and fixes files

```
npm run lint
npm run format
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Multilingual (i18n) Support

wis2box-ui has multilingual support via [vue i18n](https://vue-i18n.intlify.dev/).

### Contributing to i18n

To add a supported locale to wis2box-ui, create a branch of wis2box-ui and navigate to `wis2box-ui/src/locales/`. From there, create a copy of `_template.json` with the name of the new locale as the name of the file (i.e. `en.json`, `en-US.json`, etc...). Create entries for the empty double quoted fields and submit a pull request back into the main branch. The default language of wis2box-ui is English (en).

#### To create an entry for German (de):

```
git clone https://github.com/wmo-im/wis2box-ui.git
cd ./src/locales
cp _template.json de.json
```

At this point, you can cross reference language support with a command like:

```
cat en.json
```

Then to edit the german locale:

```
vi de.json
```

## Releasing

```bash
# create release (x.y.z is the release version)
vi package.json  # update "version"
vi package-lock.json  # update 'version' and 'packages."".version
git commit -am 'update release version x.y.z'
git push origin main
git tag -a x.y.z -m 'tagging release version x.y.z'
git push --tags

# publish release on GitHub (https://github.com/wmo-im/wis2box-ui/releases/new)
```

### Code Conventions

- [@vue/cli-plugin/eslint](https://cli.vuejs.org/core-plugins/eslint.html)

## Issues

Please direct all issues to the [main wis2box issue tracker](https://github.com/wmo-im/wis2box/issues)

## Contact

- [Tom Kralidis](https://github.com/tomkralidis)
