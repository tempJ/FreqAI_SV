<template>
  <!-- <v-container> -->
    <v-expansion-panels class="panel">
      <v-expansion-panel>
        <v-expansion-panel-header>Config</v-expansion-panel-header>

        <v-expansion-panel-content>
            <v-col>
              <p>Interval</p>
              <v-text-field
              v-model="vSetInterval"
              :rules="rules.interval"
              >
              </v-text-field>
            </v-col>

            <v-col>
              <p>Integration</p>
              <v-text-field
              v-model="vIntegration"
              :rules="rules.integration"
              >
              </v-text-field>
            </v-col>

            <div class="button">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                  icon
                  color="success"
                  v-on="on"
                  v-bind="attrs"
                  @click="setConfig"
                  >
                    <v-icon>settings</v-icon>
                  </v-btn>
                </template>
                <span>Set config</span>
              </v-tooltip>

              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                  icon
                  color="primary"
                  v-on="on"
                  v-bind="attrs"
                  @click="saveConfig"
                  >
                    <v-icon>save</v-icon>
                  </v-btn>
                </template>
                <span>Save config to json file</span>
              </v-tooltip>
            </div>
            
          <!-- </v-card> -->
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  <!-- </v-container> -->
</template>

<script>
import fs from 'fs';

  export default {
    name: 'ConfigSet',

    data: () => ({
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
        fs.readFile('./public/config.json', 'utf-8', (err, data) => {
          if(err === null){
            const config = JSON.parse(data);
            this.vSetInterval = config.interval;
            this.vIntegration = config.integration;
            
          }
          else{
            this.vSetInterval = '100';
            this.vIntegration = '1000';
          }
        });
      },

      setConfig(){
        this.$emit("config", this.setIntervalTime);
      },

      saveConfig(){
        let config = new Object();
        config.interval = this.vSetInterval;
        config.integration = this.vIntegration;

        fs.writeFile('./public/config.json', JSON.stringify(config), (err) => {
          if(err !== null){ return -1; }
        });
      }
    },

    watch: {
      // setIntervalTime: function(){
      //   console.log(this.setIntervalTime)
      // }
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
  width: 460px;
}
.container{
  /* margin: 30px 0px 0px 0px; */
  padding: 20px 20px 20px 20px;
  
  /* width: 100%; */
}

/* .footer{
  background-color: rgba(255, 255, 255, 0);
} */

.button{
  text-align: right;
}
</style>