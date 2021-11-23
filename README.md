# wis2node-ui

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your end-to-end tests
```
npm run test:e2e
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Multilingual (i18n) Support
wis2node-ui has multilingual support via [vue i18n](https://vue-i18n.intlify.dev/). 

### Contributing to i18n
To add a supported locale to wis2node-ui, create a branch of wis2node-ui and navigate to `wis2node-ui/src/locales/`. From there, create a copy of `_template.json` with the name of the new locale as the name of the file (i.e. `en.json`, `en-US.json`, etc...). Create entries for the empty double quoted fields and submit a pull request back into the main branch. The default language of wis2node-ui is Enligsh (en).

#### To create an entry for German (de):
```
git clone https://github.com/wmo-im/wis2node-ui.git
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
