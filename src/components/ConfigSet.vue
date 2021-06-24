<template>
  <v-container>
    <v-card
    tile
    >
      <v-navigation-drawer
      app
      permanent
      width="320px"
      :color="color[theme]"
      :dark="(theme === 2)? true : false"
      >
        <v-list-item>

          <v-spacer></v-spacer>
          
          <v-btn
          small
          icon
          @click="theme = (theme+1)%3"
          >
            <v-icon>lightbulb</v-icon>
          </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list
        dense
        >
          <v-list-group
          :value="true"
          >
            <template v-slot:activator>
              <v-list-item-icon>
                <v-icon>waves</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Selected Wave</v-list-item-title>
            </template>

            <v-list-item
            v-for="(el, i) in range"
            :key="i"
            >
              <v-list-item-content>
                <v-row>
                  <v-col sm="2">
                    <v-checkbox
                    hide-details
                    :disabled="run"
                    v-model="series[i]"
                    ></v-checkbox>
                  </v-col>
                  <v-col>
                    <v-row style="margin: 0px;">
                      <v-col style="padding: 0px">
                        <v-range-slider
                        hide-details
                        single-line
                        :disabled="run"
                        v-model="range[i]"
                        min="0"
                        max="2047"
                        ></v-range-slider>
                      </v-col>
                    </v-row>

                    <v-row style="margin: 0px;">
                      <v-col sm="6" style="padding: 3px">
                      <b-form-spinbutton
                      class="spin"
                      :disabled="run"
                      v-model="el[0]"
                      :formatter-fn="wLTable"
                      min="0"
                      :max="el[1]"
                      ></b-form-spinbutton>
                      </v-col>
                      <v-col sm="6" style="padding: 3px">
                        <b-form-spinbutton
                        class="spin"
                        :disabled="run"
                        v-model="el[1]"
                        :formatter-fn="wLTable"
                        :min="el[0]"
                        max="2047"
                        ></b-form-spinbutton>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
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
              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                type="number"
                prefix="Interval Time:"
                suffix="ms"
                :disabled="run"
                v-model="interval"
                @blur="checkComp"
                @keyup.enter="checkComp"
                >
                </v-text-field>
              </v-list-item-content> 
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                type="number"
                prefix="Integration Time:"
                suffix="ms"
                :disabled="run"
                v-model="integration"
                @blur="checkComp"
                @keyup.enter="checkComp"
                >
                </v-text-field>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-content>
                <v-text-field
                class="input"
                dense
                type="number"
                prefix="Sampling Time:"
                suffix="ms"
                :disabled="run"
                v-model="sampling"
                @blur="checkComp"
                @keyup.enter="checkComp"
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
                <v-list-item-content>
                  <v-row style="margin: 0px;">
                    <v-col style="padding: 0px">
                      <v-range-slider
                      hide-details
                      single-line
                      v-model="auto"
                      min="0"
                      max="2047"
                      ></v-range-slider>
                    </v-col>
                  </v-row>

                  <v-row style="margin: 0px;">
                    <v-col sm="6" style="padding: 3px">
                    <b-form-spinbutton
                    class="spin"
                    v-model="auto[0]"
                    :formatter-fn="wLTable"
                    min="0"
                    :max="auto[1]"
                    ></b-form-spinbutton>
                    </v-col>
                    <v-col sm="6" style="padding: 3px">
                      <b-form-spinbutton
                      class="spin"
                      v-model="auto[1]"
                      :formatter-fn="wLTable"
                      :min="auto[0]"
                      max="2047"
                      ></b-form-spinbutton>
                    </v-col>
                  </v-row>

                  <v-text-field
                  class="input"
                  dense
                  type="number"
                  prefix="Threshold:"
                  v-model="threshold"
                  @blur="checkComp"
                  @keyup.enter="checkComp"
                  >
                  </v-text-field>

                  <v-checkbox
                  class="checkbox"
                  dense
                  hide-details
                  label="Using auto save?"
                  v-model="use"
                  ></v-checkbox>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

          </v-list-group>
        </v-list>
        
        <v-divider></v-divider>

        <template v-slot:append>
          <v-list
          dense
          >
            <v-list-item
            link
            :disabled="run"
            @click="setConfig"
            >
              <v-list-item-icon>
                <v-icon color="success">tune</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title>Set Config</v-list-item-title>
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
                <v-list-item-title>Save Config</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

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
        </template>
      </v-navigation-drawer>
    </v-card>
  </v-container>
</template>

<script>
import fs from 'fs';

const configPath = 'C:/Users/Administrator/Documents/FreqAi SV/config.json';
const snack = {
  'config': {
    'found': { suc: 1, msg: 'config.json found and loaded.' },
    'notfound': { suc: -1, msg: 'config.json not found, so loaded default values.' },
    'set': { suc: 1, msg: 'Set config' },
    'save': { suc: 0, msg: 'Save config.json' }
  },
  'save': { suc: 1, msg: 'Save file: '}
};

  export default {
    props: {
      run: Boolean,
      table: Array,
      limit: Object,
      save: Object,
    },
    name: 'ConfigSet',

    data: () => ({
      theme: 0,
      color: ['white', '#EEEEEE', 'normal'],

      interval: 100,
      integration: 25,
      sampling: 1000,

      threshold: 10000,
      use: true,

      wL: null,
      auto: [1000, 1024],
      series: [true, true, true, true, true],
      range: [
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
        [0, 0],
      ],

      recipe: {
        path: 'C:/Users/Administrator/Documents/FreqAi SV/csv',
        interval: 100,
        integration: 25,
        sampling: 1000,
        auto: {
          start: 548,
          end: 557,
          threshold: 10000,
          use: true
        },
        wave: [
          { view: true, start: 0, end: 0 },
          { view: true, start: 0, end: 0 },
          { view: true, start: 0, end: 0 },
          { view: true, start: 0, end: 0 },
          { view: true, start: 0, end: 0 },
        ],
      },
    }),

    methods: {
      createConfig(){
        fs.readFile(configPath, 'utf-8', (err, data) => {
          try{
            Object.assign(this.recipe, JSON.parse(data));
            this.$emit("snack", snack.config.found);
          }
          catch(err){
            this.$emit("snack", snack.config.notfound);
          }

          this.recipe = this.checkRecipe(this.recipe);
          this.recp2Comp(this.recipe);

          this.$emit("config", this.recipe);
        });
      },

      openSetting() {

      },

      setConfig(){
        this.recipe = this.checkRecipe(this.comp2Recp());
        this.$emit("config", this.recipe);
        this.$emit("snack", snack.config.set);
      },

      saveConfig(){
        this.recipe = this.checkRecipe(this.comp2Recp());
        fs.writeFile(configPath, JSON.stringify(this.recipe), (err) => {
          if(err !== null){ return -1; }
          this.$emit("snack", snack.config.save);
        });
      },

      checkRecipe(recp){
        const ret = new Object();
        Object.assign(ret, recp);

        ret.interval = parseInt(ret.interval);
        ret.integration = parseInt(ret.integration);
        ret.sampling = parseInt(ret.sampling);
        console.log(ret.auto);

        ret.auto.start = this.roundWL(parseFloat(ret.auto.start));
        ret.auto.end = this.roundWL(parseFloat(ret.auto.end));
        ret.auto.threshold = parseInt(ret.auto.threshold);
        ret.auto.use = this.checkBool(ret.auto.use);

        if(ret.auto.start > ret.auto.end){
          const tmp = ret.auto.start;
          ret.auto.start = ret.auto.end;
          ret.auto.end = tmp;
        }

        ret.wave.forEach((el) => {
          el.view = this.checkBool(el.view);
          el.start = this.roundWL(parseFloat(el.start));
          el.end = this.roundWL(parseFloat(el.end));

          if(el.start > el.end){
            const tmp = el.start;
            el.start = el.end;
            el.end = tmp;
          }
        });

        return ret;
      },

      recp2Comp(recipe){
        this.interval = recipe.interval;
        this.integration = recipe.integration;
        this.sampling = recipe.sampling;

        this.auto[0] = this.wL.indexOf(recipe.auto.start);
        this.auto[1] = this.wL.indexOf(recipe.auto.end);
        this.threshold = recipe.auto.threshold;
        this.use = recipe.auto.use;

        this.range.forEach((el, i) => {
          this.series[i] = recipe.wave[i].view;
          el[0] = this.wL.indexOf(recipe.wave[i].start);
          el[1] = this.wL.indexOf(recipe.wave[i].end);
        });
      },

      comp2Recp(){
        const recipe = new Object();

        recipe.interval = this.interval;
        recipe.integration = this.integration;
        recipe.sampling = this.sampling;

        recipe.auto = {
          start: this.wL[this.auto[0]],
          end: this.wL[this.auto[1]],
          threshold: this.threshold,
          use: this.use
        };

        recipe.wave = this.range.map((el, i) => {
          return {
            view: this.series[i],
            start: this.wL[el[0]],
            end: this.wL[el[1]]
          };
        });

        return recipe;
      },

      checkBool(val){
        const type = typeof val;

        if(type === 'boolean'){ return val; }
        else if(type === 'number'){ return (val < 1)? false : true; }
        else if(type === 'string'){
          const str = val.toLowerCase();
          if(str === 'true' || str === 't'){ return true; }
          else if(str === 'false' || str === 'f'){ return false; }
          else{ return true; }
        }
        else{ return true; }
      },

      wLTable(val){
        return this.wL[val].toFixed(2);
      },

      roundWL(wave){
        const table = this.wL;

        const find = table.find((el) => el >= wave);
        const up = (find === undefined)? table[table.length - 1] : find;

        const indexOf = table.indexOf(up);
        const down = table[(indexOf === 0)? 0 : indexOf - 1];

        return ((up-wave) > (wave-down))? down : up;
      },

      checkComp(){
        let interval = parseInt(this.interval);
        let integration = parseInt(this.integration);
        let sampling = parseInt(this.sampling);
        let threshold = parseInt(this.threshold);
        
        if(isNaN(interval) || interval < 1){ interval = 100; }
        if(isNaN(integration) || integration < 1){ integration = 25; }
        if(isNaN(sampling) || sampling < 1){ sampling = 1000; }
        if(isNaN(threshold) || threshold < 1){ threshold = 10000; }

        if(interval < integration){
          const tmp = interval;
          interval = integration;
          integration = tmp;
        }
        if(interval-integration < 30){
          integration = (integration > 30)? integration - 30 : integration;
          interval = (integration > 30)? interval : interval + 30;
        }

        this.interval = interval;
        this.integration = integration;
        this.sampling = sampling;
        this.threshold = threshold;
      }
    },

    watch: {
      table: {
        deep: true,

        handler(val){
          if(val.length > 0) { this.wL = val; }
        }
      },

      save: {
        deep: true,

        handler(val){
          const path = this.recipe.path;
          const file = val.prefix + '\r\n' + val.data.join('\r\n');

          fs.mkdir(`${path}`, () => {
            fs.writeFile(`${path}/${val.name}.csv`, file, (err) => {
              if(err !== null){
                this.$emit("snack", { suc: -1, msg: err });
                return -1;
              }

              this.$emit("snack", {
                suc: snack.save.suc,
                msg: snack.save.msg + val.name + '.csv'
              });
            });
          });
        }
      },
    },

    computed: {

    },

    created() {
      console.log('> created ConfigSet');
      this.createConfig();
      this.wL = new Array(2048).fill(0).map((el, i) => { return i; });
    },
    mounted() {
      console.log('> mounted ConfigSet');
    }
  }
</script>

<style scoped>
.input {
  height: 30px;
  font-size: 12px;
}
.spin {
  height: 32px;
  font-size: 12px;
}
::v-deep .checkbox .v-label{
  font-size: 12px;
}
</style>