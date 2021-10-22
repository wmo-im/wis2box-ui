<template>
  <footer>
    <p>
      Powered by <a :title="name" :href="homepage">{{ name }}</a> {{ version }}
    </p>
  </footer>
</template>

<script>
import { name, version, homepage } from "../../package";

export default {
  name: "AppFooter",
  data() {
    return {
      version: version,
      name: name,
      homepage: homepage,
    };
  },
};
</script>
