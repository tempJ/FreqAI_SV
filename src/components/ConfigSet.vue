<template>
  <v-container>
    <v-card
    tile
    >
      <v-navigation-drawer
      app
      permanent
      v-model="drawer"
      :mini-variant.sync="mini"
      >
      <!-- <v-list link> -->
        <v-list-item>

        <!-- <v-list-item-title>John Leider</v-list-item-title> -->
          <!-- <template v-slot:activator> -->
            <!-- <v-list-item-icon
            @click.stop="mini = !mini"
            > -->
            <v-btn
            small
            icon
            plain
            color="secondary"
            @click.stop="mini = !mini"
            >
              <v-icon v-if="mini">mdi-chevron-right</v-icon>
              <v-icon v-else>mdi-chevron-left</v-icon>
            </v-btn>
            <!-- </v-list-item-icon> -->
          <!-- </template> -->
        </v-list-item>
      <!-- </v-list> -->
        

        <v-divider></v-divider>

        <v-list
        dense
        >
          <v-list-group>
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>waves</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Selected Wave</v-list-item-title>
            </template>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>label</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>

        <v-divider></v-divider>

        <v-list
        dense
        >
          <v-list-group>
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>list</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Config</v-list-item-title>
            </template>
          
            <v-list-item>
              <v-list-item-icon>
                <v-icon>arrow_right</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                filled
                rounded
                prefix="Interval"
                suffix="ms"
                v-model="vSetInterval"
                :rules="rules.interval"
                >
                </v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>arrow_right</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                filled
                rounded
                prefix="Integration"
                suffix="ms"
                v-model="vIntegration"
                :rules="rules.integration"
                >
                </v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>

        <v-divider></v-divider>

        <template v-slot:append>
          <v-list
          dense
          >
            <v-list-item
            link
            @click="setConfig"
            >
              <v-list-item-icon>
                <v-icon color="success">settings</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Set</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
            tile
            link
            @click="saveConfig"
            >
              <v-list-item-icon>
                <v-icon color="primary">save</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Save</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>

      </v-navigation-drawer>
      <!-- <DataChart/> -->
    </v-card>
    <!-- <v-row class="content">
      <v-col cols="5">
        <v-subheader>Interval</v-subheader>
      </v-col>
      <v-col cols="7">
        <v-text-field
        class="input"
        dense
        filled
        rounded
        suffix="ms"
        v-model="vSetInterval"
        :rules="rules.interval"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <v-divider class="divider"></v-divider>

    <v-row class="content">
      <v-col cols="5">
        <v-subheader>Integration</v-subheader>
      </v-col>
      <v-col cols="7">
        <v-text-field
        class="input"
        dense
        filled
        rounded
        suffix="ms"
        v-model="vIntegration"
        :rules="rules.integration"
        >
        </v-text-field>
      </v-col>
    </v-row>

    <div class="button">
      <v-btn
      text
      rounded
      color="success"
      @click="setConfig"
      >
        <v-icon left>settings</v-icon>Set
      </v-btn>
      <v-btn
      text
      rounded
      color="primary"
      @click="saveConfig"
      >
        <v-icon left>save</v-icon>Save
      </v-btn>
    </div> -->
  </v-container>
</template>

<script>
// import DataChart from './DataChart';
import fs from 'fs';

  export default {
    // components: {
    //   DataChart,
    // },
    name: 'ConfigSet',

    data: () => ({
      drawer: true,
      mini: true,

      vSetInterval: null,
      vIntegration: null,
      // intervalTime: 100,
      // integrationTime: 1000,

      rules: {
        interval: [
          value => !!value || 'Required',
          value => (value && value < 9999 && !isNaN(value*1)) || 'Input valid interval time',
        ],
        integration: [
          value => !!value || 'Required',
          value => (value && value < 9999 && !isNaN(value*1)) || 'Input valid integration time',
        ],
      }
    }),

    methods: {
      createConfig(){
        fs.readFile('./config.json', 'utf-8', (err, data) => {
          if(err === null){
            const config = JSON.parse(data);
            this.vSetInterval = config.interval;
            this.vIntegration = config.integration;
            
          }
          else{
            this.vSetInterval = '100';
            this.vIntegration = '1000';
          }

          this.$emit("config", parseInt(this.vSetInterval));
        });
      },

      setConfig(){
        // console.log(this.setIntervalTime)
        // console.log(this.setIntervalTime)
        this.$emit("config", this.setIntervalTime);
      },

      saveConfig(){
        let config = new Object();
        config.interval = this.vSetInterval;
        config.integration = this.vIntegration;
        // const filePath = 'C:/Users/Administrator/Documents/kspChart/saveData';

        fs.writeFile('./config.json', JSON.stringify(config), (err) => {
          if(err !== null){ return -1; }
        });
      }
    },

    computed: {
      setIntervalTime(){
        return parseInt(this.vSetInterval)
      },
      integrationTime(){
        return parseInt(this.vIntegration)
      }
    },

    mounted() {
      this.createConfig();
    }
  }
</script>

<style scoped>
.panel {
  margin: 0px;
  width: 380px;
}
/* .container{
  padding: 20px 20px 20px 20px;
} */

.content {
  /* height: 40px; */
  margin: 0px;
  padding: 0px;
}

.divider{
  margin-bottom: 10px;
}
.input {
  height: 30px;
  /* align-items: center; */
  /* text-align: center; */
  font-size: 12px;
}
/* .footer{
  background-color: rgba(255, 255, 255, 0);
} */

.button{
  /* margin: 20px; */
  text-align: right;
}
</style>