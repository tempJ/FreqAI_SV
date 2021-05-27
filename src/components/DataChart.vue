<template>
  <v-container>
    <v-expand-transition>
      <v-alert
      class="card"
      border="left"
      type="error"
      elevation="2"
      tile
      v-if="err.show"
      >
        {{ err.msg }}
      </v-alert>
    </v-expand-transition>

    <v-card
    class="card"
    tile
    >
      <v-sparkline
      :value="data"
      :color="options.dataColor"
      :smooth="options.radian || false"
      :line-width="options.width"
      :fill="options.fill"
      :type="options.type"
      auto-draw
      ></v-sparkline>
    </v-card>

    <v-card
    class="card"
    tile
    >
      <strong :style="{ 'margin': '20px' }">{{ wavePointData }}</strong>
      <v-sparkline
      :value="waveData"
      :color="options.waveColor"
      :smooth="options.radian || false"
      :line-width="options.width"
      :fill="options.fill"
      :type="options.type"
      auto-draw
      zoomAndPan="magnify"
      ></v-sparkline>
    </v-card>

    <v-row>
      <v-col cols="4">
        <v-card
        class="card"
        tile
        >
          <div class="body">
            <v-text-field
            label="Port"
            :rules="rules.port"
            v-model="vPort"
            >{{ vPort }}
            </v-text-field>
            <v-text-field
            label="Host"
            :rules="rules.host"
            v-model="vHost"
            >{{ vHost }}
            </v-text-field>
          </div>

          <div class="btn" :style="{'textAlign': 'right'}">
            <v-btn
            color="success"
            icon
            :disabled="disabled.open"
            @click="openSocket"
            >
              <v-icon>login</v-icon>
            </v-btn>
            <v-btn
            color="error"
            icon
            :disabled="disabled.close"
            @click="closeSocket"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </div>

        </v-card>
      </v-col>
      <v-col>
        <v-card
        class="card"
        tile
        >
          <v-expansion-panels accordion><v-expansion-panel>
          <v-expansion-panel-header>Recive Data</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table>
                <!-- <template v-slot:default> -->
                  
                  <!-- <thead>
                    <tr>
                      <th>
                        <v-btn
                        text
                        tile
                        :style="{'padding': '5px'}"
                        @click="displayData"
                        >
                          <v-icon left>refresh</v-icon>Recive Data
                        </v-btn>
                      </th>
                    </tr>
                  </thead> -->
                  
                  
                  <tbody>
                    <tr
                    v-for="(item, idx) in data"
                    :key="idx"
                    >
                      <td :style="{'fontSize': '12px'}">{{ item }}</td>
                    </tr>
                  </tbody>
                  
                <!-- </template> -->
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel></v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const remote = window.electron.remote;
const { Socket } = remote.getGlobal('net');
const JsonSocket = require('json-socket');

const size = 2048;

  export default {
    name: 'DataChart',

    data: () => ({
      data: [],
      // vData: [],
      port: '',
      host: '',
      vPort: '',
      vHost: '',
      wave: '',
      waveData: [],
      // wavePointData: '',

      socket: null,
      disabled: {
        open: false,
        close: true
      },

      err: {
        show: false,
        msg: ''
      },

      options: {
        dataColor: 'blue accent-3',
        waveColor: 'red accent-3',
        fill: false,
        type: 'trend',
        radian: 0,
        width: 0.4
      },

      rules: {
        port: [
          value => !!value || 'Required',
          value => (value && value.length === 4 && !isNaN(value*1)) || 'Input valid port number',
        ],
        host: [
          value => !!value || 'Required',
          value => (value && value.length < 16 && isNaN(value*1)) || 'Input valid host address',
        ]
      }
    }),

    methods: {
      test(){
        console.log(this.port);
      },
      genRanArr(){
        const tmp = [];
        for(;;){
          tmp.push(Math.round(Math.random()*10000)/100);
          if(tmp.length === size) break;
        }
        return tmp;
      },
      genZeroArr(){
        const tmp = [];
        for(;;){
          tmp.push(0);
          if(tmp.length === size) break;
        }
        return tmp;
      },

      // Socket method
      async openSocket(){
        if(this.socket !== null){
          // this.err.show = true;
          this.err.msg = `current port: ${this.port}`;
          return this.err.show = true;
          // return alert(`current port: ${this.port}`);
        }

        if(this.vPort.length !== 4 || isNaN(this.vPort * 1)){
          this.err.msg = `Input valid port(4 digit): ${this.vPort}`;
          return this.err.show = true;
          // return alert(`input 4 digit port: ${this.vPort}`);
        }

        // for(let i=0; i<2048; i++){
        //   this.data = this.genRanArr();
        //   console.log(this.data);
        // }
        
        this.port = this.vPort * 1;
        this.host = this.vHost;

        this.err.show = false;
        this.disabledBtn(true);

        this.socket = new JsonSocket(new Socket());
        this.socket.connect(this.port, this.host);
        // console.log(this.socket)

        this.socket.on('connect', () => {
          this.socket.sendMessage({ success: true });
          this.socket.on('message', (msg) => {
            if(msg.format !== 'JSON'){
              this.err.msg = `Use json`;
              return this.err.show = true;
              // return alert(`use json`);
            }
            // console.log(msg);
            this.data = msg.data;
          })
        })

        // this.socket = createServer((socket) => {
        //   socket = new JsonSocket(socket);
        //   socket.on('message', (msg) => {
        //     if(msg.format !== 'JSON'){ return alert(`use json`); }
        //     this.data = msg.data;

        //     // if(this.point !== null){
        //     //   this.genPointData();
        //     // }

        //     // console.log(this.data);
        //   })
        // });

        // this.server.listen(this.port);
      },

      closeSocket(){
        if(this.socket === null){ return alert(`current port is undefined`); }

        this.socket.end();
        this.socket = null;
        // if(this.server === null){ return alert(`current port is undefined`); }

        // this.server.close();
        // this.server = null;
        // console.log(`port close`);

        this.disabledBtn(false);
      },

      async takeWaveData(){
        const focus = this.point;
        this.pushData(this.pData, this.data[focus]);
      },

      pushData(data, item){
        // if(data[data.length-1]){
        //   data.shift();
        // }
        // else{
        //   data.shift();
        //   data.push(item);
        // }
        if(data.length >= size){ data.shift(); }
        // data.shift();
        data.push(item);
      },

      // GUI method
      displayData(){
        this.vData = this.data;
      },

      disabledBtn(isOpen){
        this.disabled.open = isOpen;
        this.disabled.close = !isOpen;
      }
    },

    computed: {
      wavePointData: function(){
        const idx = this.wave;
        const tmp = this.data[idx];
        this.pushData(this.waveData, tmp);
        return tmp;
      }
    },
    watch: {
      // data: function(){
      //   this.vData = this.data;

      //   // const idx = this.wave;
      //   // this.wavePointData = this.vData[idx];
      //   // this.pushData(this.waveData, this.wavePointData);
      // }
    },

    mounted() {
      this.wave = 1024;
      this.vPort = '1024';
      this.vHost = 'localhost';

      this.data = this.genZeroArr();
      this.waveData = this.data;
      // this.genPointData();
    }
  }
</script>

<style scoped>
  .card {
    margin: 10px;
  }
  .body {
    padding: 20px;
  }
  .btn {
    padding: 10px;
  }
</style>