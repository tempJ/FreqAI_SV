<template>
  <v-container>
    <v-card
    tile
    >
      <v-navigation-drawer
      app
      permanent
      width="280px"
      v-model="drawer"
      :color="color[theme]"
      :dark="(theme === 2)? true : false"
      >
      <!-- <v-navigation-drawer
      app
      permanent
      width="280px"
      v-model="drawer"
      :dark="dark"
      :mini-variant.sync="mini"
      > -->
        <v-list-item>
          <!-- <v-btn
          small
          icon
          plain
          @click.stop="mini = !mini"
          >
            <v-icon v-if="mini">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-left</v-icon>
          </v-btn> -->

          <v-spacer></v-spacer>
          <v-btn
          small
          icon
          @click="theme = (theme+1)%3"
          >
            <v-icon>lightbulb</v-icon>
          </v-btn>
        </v-list-item>
        
        <!-- <v-divider></v-divider>

        <v-list
        dense
        >
          <v-list-item>
            <v-list-item-icon>
              {{ num }}
            </v-list-item-icon>
            <v-list-item-content>
              <v-slider
              dense
              min="1"
              max="6"
              v-model="num"
              >
              </v-slider>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-combobox
              dense
              >
              </v-combobox>
            </v-list-item-content>
          </v-list-item>

        </v-list> -->

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

            <v-list-item v-for="(w, i) in recipe.wave" :key="i">
              <v-list-item-icon>
                <v-checkbox
                dense
                v-model="w.view"
                ></v-checkbox>
              </v-list-item-icon>

              <v-list-item-content>
                <!-- <v-simple-table
                dense
                link="false"
                > -->
                  <!-- <template v-slot:default> -->
                    <tbody>
                      <tr>
                        <td>
                          <v-text-field
                          class="input"
                          dense
                          type="number"
                          v-model="w.start"
                          >
                          </v-text-field>
                        </td>
                        <td>
                          <v-text-field
                          class="input"
                          dense
                          type="number"
                          v-model="w.end"
                          >
                          </v-text-field>
                        </td>
                      </tr>
                    </tbody>
                  <!-- </template> -->
                <!-- </v-simple-table> -->
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>

        <v-divider></v-divider>

        <v-list
        dense
        >
          <v-list-group
          :value="true"
          >
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>list</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Config</v-list-item-title>
            </template>

            <v-list-item>
              <!-- <v-list-item-icon>
                <v-icon></v-icon>
              </v-list-item-icon> -->

              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                type="number"
                prefix="Interval Time:"
                suffix="ms"
                v-model="recipe.interval"
                >
                </v-text-field>
              </v-list-item-content> 
            </v-list-item>

            <v-list-item>
              <!-- <v-list-item-icon>
                <v-icon></v-icon>
              </v-list-item-icon> -->

              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                type="number"
                prefix="Integration Time:"
                suffix="ms"
                v-model="recipe.integration"
                >
                </v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <!-- <v-list-item-icon>
                <v-icon></v-icon>
              </v-list-item-icon> -->

              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                type="number"
                prefix="Sampling Time:"
                suffix="ms"
                v-model="recipe.sampling"
                >
                </v-text-field>
              </v-list-item-content>
            </v-list-item>


            <v-list-group
            :value="true"
            sub-group
            >
              <template v-slot:activator>
                <v-list-item-title>Auto File Save</v-list-item-title>
                <v-list-item-icon>
                  <v-icon>autorenew</v-icon>
                </v-list-item-icon>
              </template>

              <v-list-item>
                <v-list-item-icon>
                  <v-checkbox
                  dense
                  v-model="recipe.auto.use"
                  ></v-checkbox>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-text-field
                  class="input"
                  dense
                  type="number"
                  prefix="Wavelength Range Start:"
                  v-model="recipe.auto.start"
                  >
                  </v-text-field>

                  <v-text-field
                  class="input"
                  dense
                  type="number"
                  prefix="Wavelength Range End:"
                  v-model="recipe.auto.end"
                  >
                  </v-text-field>

                  <v-text-field
                  class="input"
                  dense
                  type="number"
                  prefix="Threshold:"
                  v-model="recipe.auto.threshold"
                  >
                  </v-text-field>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

            
          </v-list-group>
        </v-list>

        <v-divider></v-divider>

        <v-list
        dense
        >
          <v-list-item
          link
          @click="openSetting"
          >
            <v-list-item-icon>
              <v-icon>settings</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Settings</v-list-item-title>
          </v-list-item>
        </v-list>

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
    </v-card>
  </v-container>
</template>

<script>
import fs from 'fs';
// import { Console } from 'console';

  export default {
    // components: {
    //   DataChart,
    // },
    props: {
      save: Object
    },
    name: 'ConfigSet',

    data: () => ({
      drawer: true,
      mini: true,
      theme: 1,
      // dark: true,
      color: ['white', '#EEEEEE', 'normal'],
      // color: ['Red', 'Purple'],
      num: 1,
      // range: [1, 6],

      // vSetInterval: null,
      // vIntegration: null,
      // vSampling: null,
      config: new Object(),
      recipe: {
        path: 'C:/Users/Administrator/Documents/FreqAi SV/csv',
        interval: 100,
        integration: 25,
        sampling: 100,
        auto: {
          start: 0,
          end: 0,
          threshold: 10000,
          use: true
        },
        wave: [
          { view: false, start: 0, end: 0 },
          { view: false, start: 0, end: 0 },
          { view: false, start: 0, end: 0 },
          { view: false, start: 0, end: 0 },
          { view: false, start: 0, end: 0 },
        ],
      },

      // interval: null,
      // integration: null,
      // sampling: null,
      // intervalTime: 100,
      // integrationTime: 1000,
      // check: new Array(5),
      // wave: new Array(5),
      // wave: [
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      //   { view: false, start: 0, end: 0 },
      // ],

      rules: {
        interval: [
          value => !!value || 'Required',
          value => (value && value < 9999 && !isNaN(value*1)) || 'Input valid interval time',
        ],
        integration: [
          value => !!value || 'Required',
          value => (value && value < 9999 && !isNaN(value*1)) || 'Input valid integration time',
        ],
        sampling: [
          value => !!value || 'Required',
          value => (value && value < 9999 && !isNaN(value*1)) || 'Input valid sampling time',
        ],
        // start: [
        //   // value => (value && value < 9999 && !isNaN(value*1)) || 'Input valid wave',
        // ],
        // end: [
        //   // value => (value && value < 9999 && !isNaN(value*1)) || 'Input valid wave',
        // ],
      }
    }),

    methods: {
      createConfig(){
        fs.readFile('./config.json', 'utf-8', (err, data) => {
          if(err === null){
            Object.assign(this.recipe, JSON.parse(data));
            // console.log(this.recipe)
            // const config = JSON.parse(data);
            
            // this.interval = parseInt(config.interval);
            // this.integration = parseInt(config.integration);
            // this.sampling = parseInt(config.sampling);

            // if(config.wave.length !== undefined){
            //   config.wave.forEach((w, i) => {
            //     this.wave[i].view = w.view;
            //     this.wave[i].start = parseInt(w.start);
            //     this.wave[i].end = parseInt(w.end);
            //   });
            // }
            
          }
          // else{
            // this.interval = 100;
            // this.integration = 1000;
            // this.sampling = 1000;
          // }
          this.setConfig();
          // console.log('configset:', this.recipe)
          // console.log('configset2:', this.config)
          // Object.assign(this.config, this.recipe);
          // this.$emit("config", this.config);
        });
      },

      // makeConfig(){
      //   const config = new Object();

      //   config.interval = parseInt(this.interval);
      //   config.integration = parseInt(this.integration);
      //   config.sampling = parseInt(this.sampling);

      //   const arr = [];
      //   this.wave.forEach((w) => {
      //     const tmp = new Object();
      //     tmp.view = w.view;
      //     tmp.start = parseInt(w.start);
      //     tmp.end = parseInt(w.end);
      //     arr.push(tmp);
      //   });

      //   config.wave = arr;
        
      //   return config;
      // },
      openSetting() {

      },

      setConfig(){
        Object.assign(this.config, this.recipe);
        // console.log('config:', this.config)
        // this.$emit("set", true);
        this.$emit("config", this.config);
      },

      saveConfig(){
        // const config = this.makeConfig();

        fs.writeFile('./config.json', JSON.stringify(this.config), (err) => {
          if(err !== null){ return -1; }
        });
      },

      // convRecipe(){
      //   const recipe = this.recipe;
      //   this.recipe.interval = parseInt(recipe.interval);
      //   this.recipe.integration = parseInt(recipe.integration);
      //   this.recipe.sampling = parseInt(recipe.sampling);
      // },

      isValidWave(val, pre, isAuto=false){
        if(isAuto){
          this.changeWave(val, pre)
          // val.start = parseInt(val.start);
          // val.end = parseInt(val.end);

          // if(isNaN(val.start)){ val.start = pre.start; }
          // if(isNaN(val.end)){ val.end = pre.end; }

          // if(val.start > val.end){
          //   const tmp = val.end;
          //   val.end = val.start;
          //   val.start = tmp;
          // }
          // if(val.start < 0 || val.start === null){ val.start = 0; }
          // if(val.end >= 2080 || val.end === null){ val.end = 2079; }
        }
        else{
          val.forEach((w, i) => {
            this.changeWave(w, pre[i]);
          });
          // val.forEach((w, i) => {
          //   w.start = parseInt(w.start);
          //   w.end = parseInt(w.end);

          //   if(isNaN(w.start)){ w.start = pre[i].start; }
          //   if(isNaN(w.end)){ w.end = pre[i].end; }

          //   if(w.start > w.end){
          //     const tmp = w.end;
          //     w.end = w.start;
          //     w.start = tmp;
          //   }
          //   if(w.start < 0 || w.start === null){ w.start = 0; }
          //   if(w.end >= 2080 || w.end === null){ w.end = 2079; }
          // });
        }
        
      },
      changeWave(cur, pre){
        cur.start = parseInt(cur.start);
        cur.end = parseInt(cur.end);

        if(isNaN(cur.start)){ cur.start = pre.start; }
        if(isNaN(cur.end)){ cur.end = pre.end; }

        if(cur.start > cur.end){
          const tmp = cur.end;
          cur.end = cur.start;
          cur.start = tmp;
        }
        if(cur.start < 0 || cur.start === null){ cur.start = 0; }
        if(cur.end >= 2080 || cur.end === null){ cur.end = 2079; }
      },

      // isValidAuto(auto){
      //   const preStart = this.config.auto.start;
      //   const preEnd = this.config.auto.end;
      //   const start = parseInt(auto.start);
      //   const end = parseInt(auto.end);
      //   if(isNaN(start)){ }

        

      //   if(end >= start){
      //     this.recipe.auto.start = start;
      //     this.recipe.auto.end = end;
      //   }
      //   else{
      //     this.recipe.auto.start = end;
      //     this.recipe.auto.end = start;
      //   }
      // },

      // isValidRecipe(){
      //   // const recipe = this.recipe;
      //   // const config = this.config;
        
      //   // if(recipe.interval<=0 ||){
      //   //   this.recipe.interval = config.interval;
      //   // }
      //   // if(recipe.integration<=0){
      //   //   this.recipe.integration = config.integration;
      //   // }
      //   // if(recipe.sampling<=0){
      //   //   this.recipe.sampling = config.sampling;
      //   // }

      //   // if(recipe.interval < recipe.integration + 30){}
      //   // console.log(this.recipe)
      // },

      isValidInt(interval, integration){
        if(isNaN(interval) || isNaN(integration)){ return false; }
        if(interval <= 0){ return false; }
        if(interval < integration + 30){ return false; }
        return true;
      },
      // isValidIntegration(val, pre){
      //   if(recipe.integration <= 0){ return false; }
      //   if(recipe.integration >= recipe.interval - 30){ return false; }
      //   return true;
      // },
      isValidSampling(val){
        if(isNaN(val)){ return false; }
        if(val <= 0){ return false; }
        // if(recipe.sampling){ return false; }
        return true;
      }
    },

    watch: {
      // theme: function (val){
      //   console.log(val)
      // },
      // recipe: {
      //   deep: true,

      //   handler(){
      //     this.isValidWave();
      //     // this.convRecipe();
      //   }
      // },
      'recipe.wave': {
        deep: true,

        handler(val){
          const pre = this.config.wave;
          this.isValidWave(val, pre);
        }
      },

      'recipe.interval': function(val){
        const pre = this.config.interval;
        this.recipe.interval = parseInt(val);

        // console.log('curr:', val);
        if(!this.isValidInt(val, this.recipe.integration)){
          this.recipe.interval = pre;
        }
      },

      'recipe.integration': function(val){
        const pre = this.config.integration;
        this.recipe.integration = parseInt(val);

        // console.log('curr:', val);
        if(!this.isValidInt(val, this.recipe.integration)){
          this.recipe.integration = pre;
        }
      },

      'recipe.sampling': function(val){
        const pre = this.config.sampling;
        this.recipe.sampling = parseInt(val);

        // console.log('curr:', val);
        if(!this.isValidSampling(val)){
          this.recipe.sampling = pre;
        }
      },

      'recipe.auto': {
        deep: true,

        handler(val){
          const pre = this.config.auto;
          this.isValidWave(val, pre, true);
        }
      },

      save: {
        deep: true,

        handler(val){
          // console.log(val.name)
          // const filePath = this.config.path;
          // fs.mkdir(`${filePath}`, () => {
          //   fs.writeFile(`${filePath}/${val.name}.csv`, "file", (err) => {
          //     console.log('ing')
          //     if(err !== null){ console.log(err);
          //     return -1; }
          //     console.log('success')
          //   });
          // });
          
          if(val.data.length < 1){ return -1; }
          if(!val.hold){
            const path = this.config.path;
            const file = val.prefix + '\r\n' + val.data.join('\r\n');

            fs.mkdir(`${path}`, () => {
              fs.writeFile(`${path}/${val.name}.csv`, file, (err) => {
                if(err !== null){ return -1; }
              });
            });
          }
        }
      }
    },

    computed: {
      // setIntervalTime(){
      //   return parseInt(this.vSetInterval)
      // },
      // integrationTime(){
      //   return parseInt(this.vIntegration)
      // },
      // samplingTime(){
      //   return parseInt(this.vSampling)
      // }
    },

    created() {
      this.createConfig();
    }
  }
</script>

<style scoped>
.input {
  height: 30px;
  /* align-items: center; */
  /* text-align: center; */
  font-size: 12px;
}
</style>