<template>
  
  <v-app>
    <!-- <v-navigation-drawer>
      <v-card>d</v-card>
    </v-navigation-drawer> -->
    
    <config-set
    @config="sendConfig"
    />
    <div
    @dragover="dragOver"
    @drop="dropOn"
    >
      <v-main>
        <data-chart
        :config="config"
        />
      </v-main>
    </div>

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
          align-with-t  itle
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
        <!-- <v-main>
          <DataChart/>
        </v-main> -->
      <!-- </v-tab-item>
    </v-tabs-items> -->
    
  </v-app>
</template>

<script>
import ConfigSet from './components/ConfigSet';
import DataChart from './components/DataChart';

export default {
  name: 'App',

  components: {
    ConfigSet,
    DataChart,
  },

  data: () => ({
    config: null,
    // tabPage: null,
    // tabList: ['Chart']
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

    sendConfig(e){
      this.config = e;
    }
  }
};
</script>

<style scoped>
  /* .navi{
    background-color: rgba(255, 255, 255, 0);
    z-index: 4096;
  } */
</style>