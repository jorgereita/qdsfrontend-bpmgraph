<template>
  <v-app>
    <v-main>
      <graph/>
    </v-main>
  </v-app>
</template>

<script>
import graph from '@/components/graph.vue';

export default {
  name: 'App',

  components: {
    graph,
  },

  data: () => ({
    //
  }),
};
</script>
