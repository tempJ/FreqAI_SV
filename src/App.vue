<template>
  <v-app>
    <!-- <v-app-bar
    color="primary"
    ></v-app-bar> -->

    <v-main>
      <DataChart/>
    </v-main>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import DataChart from './components/DataChart';

export default {
  name: 'App',

  components: {
    DataChart,
  },

  data: () => ({
    //
  }),
};
</script>
