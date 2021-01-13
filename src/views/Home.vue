<template>
  <div>
    <graph />
  </div>
</template>

<script>
// @ is an alias to /src
import graph from '@/components/graph.vue';

export default {
  name: 'Home',
  components: {
    graph,
  },
};
</script>
