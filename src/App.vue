<template>
  
  <v-app>
    <!-- <div class="ma-12 pa-12"> -->
    <div
    @dragover="dragOver"
    @drop="dropOn"
    >
    <v-card>
      <v-navigation-drawer
        permanent
        expand-on-hover
      >
        <v-list>
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
            </v-list-item-avatar>
          </v-list-item>

          <v-list-item link>
            <v-list-item-content>
              <v-list-item-title class="text-h6">
                Sandra Adams
              </v-list-item-title>
              <v-list-item-subtitle>sandra_a88@gmail.com</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <config-set
          @config="setConfig"
          />
        </v-list>
        <!-- <div class="footer">
          
        </div> -->

        <!-- <v-list
          nav
          dense
        >
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-folder</v-icon>
            </v-list-item-icon>
            <v-list-item-title>My Files</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-account-multiple</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Shared with me</v-list-item-title>
          </v-list-item>
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-star</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Starred</v-list-item-title>
          </v-list-item>
        </v-list> -->
      </v-navigation-drawer>
    </v-card>
  <!-- </div> -->

    
    
    
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
        <v-main>
          <DataChart/>
        </v-main>
      <!-- </v-tab-item>
    </v-tabs-items> -->
    </div>
  </v-app>
</template>

<script>
import DataChart from './components/DataChart';
import ConfigSet from './components/ConfigSet';

export default {
  name: 'App',

  components: {
    ConfigSet,
    DataChart,
  },

  data: () => ({
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
  }
};
</script>

<style scoped>
  .footer{
    position: fixed;
    /* background-color: rgba(255, 255, 255, 0); */
    /* :style="{'padding': '0px'}" */
    /* margin-left: 50%; */
  }
</style>