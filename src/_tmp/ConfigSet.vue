<template>
  <!-- <v-container> -->
    <v-expansion-panels
    class="panel"
    dense
    tile
    >
      <v-expansion-panel>
        <v-expansion-panel-header>Config</v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-row class="content">
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

            <!-- <v-row>
              <v-col cols="6">
                <v-subheader>Interval</v-subheader>
              </v-col>
              <v-col cols="6">
                <v-text-field
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

            <v-row>
              <v-col cols="6">
                <v-subheader>Integration</v-subheader>
              </v-col>
              <v-col cols="6">
                <v-text-field
                dense
                filled
                rounded
                suffix="ms"
                v-model="vIntegration"
                :rules="rules.integration"
                >
                </v-text-field>
              </v-col>
            </v-row> -->

            <v-row>
            <div class="button">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                  text
                  rounded
                  color="success"
                  v-on="on"
                  v-bind="attrs"
                  @click="setConfig"
                  > -->
                    <v-icon left>settings</v-icon>Set
                  </v-btn>
                </template>
                <span>Set config</span>
              </v-tooltip>
              <v-spacer></v-spacer>
              &nbsp;
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                  text
                  rounded
                  color="primary"
                  v-on="on"
                  v-bind="attrs"
                  @click="saveConfig"
                  >
                    <v-icon left>save</v-icon>Save
                  </v-btn>
                </template>
                <span>Save config to json file</span>
              </v-tooltip>
            </div>
            </v-row>
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
  font-size: 14px;
}
/* .footer{
  background-color: rgba(255, 255, 255, 0);
} */

.button{
  /* margin: 20px; */
  text-align: right;
}
</style>