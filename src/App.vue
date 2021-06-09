<template>
  <v-app>
    
    <div
    @dragover="dragOver"
    @drop="dropOn"
    >

    
    <!-- <v-card
    dense
    >
      <v-app-bar
      fixed
      dense
      tile
      elevate-on-scroll
      color="white"
      >
        <template v-slot:extension>
          <v-tabs
          v-model="tabPage"
          align-with-title
          >
            <v-tabs-slider></v-tabs-slider>

            <v-tab
            v-for="tab in tabList"
            :key="tab"
            >
              {{ tab }}
            </v-tab>

          </v-tabs>
        </template>
      </v-app-bar>
    </v-card>

    <v-tabs-items
    v-model="tabPage"
    >
      <v-tab-item> -->
        <v-main>
            <DataChart/>
        </v-main>
      <!-- </v-tab-item>
    </v-tabs-items> -->
    </div>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import DataChart from './components/DataChart';
import ConfigSet from './components/ConfigSet';

export default {
  name: 'App',

  components: {
    DataChart,
    ConfigSet
  },

  data: () => ({
    tabPage: null,
    // tabs: [DataChart, ConfigSet],
    tabList: ['Chart']
  }),

  methods: {
    dragOver(e){
      e.preventDefault();
    },
    dropOn(e){
      const targetId = e.dataTransfer.getData('targetId');
      const shiftX = e.dataTransfer.getData('shiftX');
      const shiftY = e.dataTransfer.getData('shiftY');

      e.preventDefault();
      this.moveAt(targetId, shiftX, shiftY, e.pageX, e.pageY);
    },
    moveAt(targetId, shiftX, shiftY, pageX, pageY){
      const obj = document.getElementById(targetId);
      
      obj.style.left = pageX - shiftX + 'px';
      obj.style.top = pageY - shiftY + 'px';
    },
  }
};
</script>
