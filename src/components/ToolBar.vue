<template>
  <v-container>
    <!-- <v-card
    flat
    tile
    >
      <v-toolbar
      id="toolbar"
      dense
      floating
      >
        <v-btn
        color="success"
        icon
        @click="openUsb"
        >
          <v-icon>slideshow</v-icon>
        </v-btn>
        <v-btn
        color="primary"
        icon
        >
          <v-icon>usb</v-icon>
        </v-btn>
        <v-btn
        color="primary"
        icon
        @click="dataSave"
        >
          <v-icon>save</v-icon>
        </v-btn>
        <v-btn
        icon
        @dragstart="dragableHandler"

        >
          <v-icon>open_with</v-icon>
        </v-btn>
      </v-toolbar>
    </v-card> -->
  </v-container>
</template>

<script>
// front
import draggable from 'vuedraggable';

// back

// constant


  export default {
    components: { draggable },
    
    name: 'ToolBar',

    data: () => ({
      // chart

      // rules
      rules: {
      }
    }),

    methods: {
    },
  }
</script>

<style scoped>
  #toolbar{
    position: fixed;
    z-index: 1;
  }
</style>