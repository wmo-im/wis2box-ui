<template>
  <v-navigation-drawer color="primary" absolute>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6"> Chart Options </v-list-item-title>
        <v-list-item-subtitle> 
          Current Collection: {{ collections_choice_ }} 
        </v-list-item-subtitle>
        <v-list-item>
          <div class="pa-4">
            <v-chip-group
              v-model="collections_choice_"
              active-class="primary--text"
            >
              <v-chip
               v-for="c in collections"
               :key="c"
               @click="updateTitle(c)"
              >
                {{ c }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-list-item>
      </v-list-item-content>
    </v-list-item>
  </v-navigation-drawer> 
</template>

<script>
let oapi = process.env.VUE_APP_OAPI;

export default {
  name: "ChartNavigation",
  props: ["collections_choice"],
  data() {
    return {
      collections: [],
      collections_choice_: this.collections_choice,
    };
  },
  methods: {
    updateTitle(newTitle) {
      this.collections_choice_ = newTitle;
    },
  },
  async created() {
    this.loading = true;
    const response = await fetch(oapi + "/collections?f=json");
    const data = await response.json();
    for (var c of data.collections) {
      this.collections.push(c.id);
    }
    this.loading = false;
  },
};
</script>
