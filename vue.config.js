const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  publicPath:  "",

  transpileDependencies: ["vuetify"],

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
