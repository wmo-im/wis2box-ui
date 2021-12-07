<template id="select-locale">
  <div class="select-locale">
    <select v-model="$i18n.locale" style="color: #FFFFFF">
      <option 
       v-for="(name, lang) in languages" 
       :key="`lang-${name}`" 
       :value="lang"
      >
        {{ name }}
      </option>
    </select>
  </div>
</template>

<script>
// https://www.digitalocean.com/community/tutorials/vuejs-vue-with-i18n
import { loadLocale } from "../locales/i18n";
import { defineComponent } from "vue";

export default defineComponent({
  name: "SelectLocale",
  template: "#select-locale",
  computed: {
    languages: function () {
      const temp = {};
      for (const [key, value] of Object.entries(loadLocale())) {
        temp[key] = value.language;
      }
      return temp;
    }
  }
});
</script>
