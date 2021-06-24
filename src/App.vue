<template>
  
  <v-app>
    <!-- <v-navigation-drawer>
      <v-card>d</v-card>
    </v-navigation-drawer> -->
    
    <config-set
    :run="run"
    :table="table"
    :save="save"
    :limit="limit"
    @config="sendConfig"
    @snack="getSnack"
    />
    <div
    @dragover="dragOver"
    @drop="dropOn"
    >
      <v-main>
        <!-- <v-row>
          <v-col> -->
            <data-view
            :config="config"
            :set="set"
            @run="sendRun"
            @table="sendTable"
            @limit="sendLimit"
            @save="saveFile"
            @snack="getSnack"
            />
          <!-- </v-col>

          <v-divider vertical></v-divider>
          
          <v-col>
            <data-chart
            :config="config"
            :set="set"
            />
          </v-col>
        </v-row>

        <v-divider></v-divider>

        <v-row>
          <v-col>
            <data-chart
            :config="config"
            :set="set"
            />
          </v-col>

          <v-divider vertical></v-divider>
          
          <v-col>
            <data-chart
            :config="config"
            :set="set"
            />
          </v-col>
        </v-row> -->
        
      </v-main>
    </div>

    <v-snackbar
    shaped
    :color="(snack.suc === 0)? 'primary' : ((snack.suc === -1)? 'error' : 'success')"
    v-model="snackbar"
    timeout=3000
    >
    {{ snack.msg }}
      <template v-slot:action="{ attrs }">
        <v-btn
        icon
        color="white"
        v-bind="attrs"
        @click="snackbar = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>

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
import DataView from './components/DataView';

export default {
  name: 'App',

  components: {
    ConfigSet,
    DataView,
  },

  data: () => ({
    run: false,
    set: false,
    limit: {
      'min': 160.0,
      'max': 187.0
    },
    table: null,
    save: null,
    config: null,

    snackbar: false,
    snack: {
      suc: 0,
      msg: '',
    }
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

    sendRun(e){
      this.run = e;
    },

    sendTable(e){
      this.table = e;
      // console.log(e);
    },

    sendConfig(e){
      this.config = e;
      console.log(e);
    },

    saveFile(e){
      this.save = e;
      console.log(e);
    },

    sendLimit(e){
      this.limit = e;
      console.log(e);
    },

    getSnack(e){
      this.snack = e;
      // console.log(e);
      this.snackbar = true;
    }
  },
  created() {
    console.log('> created App')
  },

  mounted() {
    console.log('> mounted App')
  }
};
</script>

<style scoped>
  /* .navi{
    background-color: rgba(255, 255, 255, 0);
    z-index: 4096;
  } */
</style>