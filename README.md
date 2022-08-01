# wis2box-ui

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
wis2box-ui has multilingual support via [vue i18n](https://vue-i18n.intlify.dev/).

### Contributing to i18n
To add a supported locale to wis2box-ui, create a branch of wis2box-ui and navigate to `wis2box-ui/src/locales/`. From there, create a copy of `_template.json` with the name of the new locale as the name of the file (i.e. `en.json`, `en-US.json`, etc...). Create entries for the empty double quoted fields and submit a pull request back into the main branch. The default language of wis2box-ui is Enligsh (en).

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

* [@vue/cli-plugin/eslint](https://cli.vuejs.org/core-plugins/eslint.html)

### Bugs and Issues

All bugs, enhancements and issues are managed on [GitHub](https://github.com/wmo-im/wis2box-ui/issues).

## Contact

* [Tom Kralidis](https://github.com/tomkralidis)
