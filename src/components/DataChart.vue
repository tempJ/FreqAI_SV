<template>
  <v-container>
    <v-expand-transition>
      <v-alert
      class="card"
      border="left"
      :type="modal.type"
      elevation="2"
      tile
      v-if="modal.show"
      >
        {{ modal.msg }}
      </v-alert>
    </v-expand-transition>

    <line-chart :title="title[0]" :theme="0" :xData="xData" :yData="yData" :focus="true" @child="getWave"/>
    <line-chart :title="title[1]" :theme="1" :xData="xData" :yData="waveData" :focus="false"/>

    <v-row>
      <v-col cols="6">
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

          <div class="btn">
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
          <div class="data">{{ wavePointData }}</div>

          <v-expansion-panels accordion><v-expansion-panel>
          <v-expansion-panel-header>Recive Data</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-simple-table>

                  <tbody>
                    <tr
                    v-for="(item, idx) in yData"
                    :key="idx"
                    >
                      <td :style="{'fontSize': '12px'}">{{ item }}</td>
                    </tr>
                  </tbody>

              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel></v-expansion-panels>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// front
import LineChart from './LineChart';

// back
const remote = window.electron.remote;
const { Socket } = remote.getGlobal('net');

// constant
const size = 2048;

function genRanArr(){
  const tmp = [];
  for(;;){
    tmp.push(Math.round(Math.random()*10000)/100);
    if(tmp.length === size) break;
  }
  return tmp;
}
function genZeroArr(){
  const tmp = [];
  for(let i=0; i<size; i++){
    tmp.push(0);
  }
  return tmp;
}
function genSeqArr(){
  const tmp = [];
  for(let i=0; i<size; i++){
    tmp.push(i);
  }
  return tmp;
}

  export default {
    components: { LineChart },
    
    name: 'DataChart',

    data: () => ({
      // chart
      title: ['Whole Wave', 'Focus'],
      xData: genSeqArr(),
      yData: genRanArr(),
      timeData: [],
      waveData: genZeroArr(),
      wave: null,

      // socket
      port: null,
      host: null,
      
      socket: null,

      // GUI
      vPort: null,
      vHost: null,

      disabled: {
        open: false,
        close: true
      },

      modal: {
        type: 'success',
        show: false,
        msg: ''
      },

      // rules
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
      // GUI method
      disabledBtn(isOpen){
        this.disabled.open = isOpen;
        this.disabled.close = !isOpen;
      },
      displayModal(type, msg){
        this.modal.show = true;
        this.modal.type = type;
        this.modal.msg = msg;
      },
      disableModal(){
        setTimeout(() => { this.modal.show = false; }, 3000);
      },

      getWave(e){
        const curr = Math.round(e);
        if(curr === -1){
          this.displayModal('warning', `Click invalid wave point`);
          return -1;
        }
        this.wave = curr;
        this.title[1] = 'Focus: ' + curr.toString();
      },

      // Socket method
      async openSocket(){
        if(this.socket !== null){
          return this.displayModal('error', `Current port: ${this.port}`);
        }

        if(this.vPort.length !== 4 || isNaN(this.vPort * 1)){
          return this.displayModal('error', `Input valid port(4 digit): ${this.vPort}`);
        }
        
        this.port = this.vPort * 1;
        this.host = this.vHost;

        // this.modal.show = false;
        this.disabledBtn(true);

        this.socket = new Socket();
        this.socket.connect(this.port, this.host);

        this.socket.on('connect', () => {
          this.displayModal('success', `Success open port: ${this.vPort}`);
          this.socket.write('true');

          this.socket.on('data', (msg) => {
            this.yData = msg.toString().split('\n');
          })
        });

        this.socket.on('error', (err) => {
          this.displayModal('error', err);
          this.closeSocket();
        });

        this.socket.on('timeout', () => {
          this.displayModal('warning', `Socket timeout`);
          this.closeSocket();
        });
      },

      closeSocket(){
        if(this.socket === null){
          return this.displayModal('error', `Current port is undefined`);
        }

        this.socket.end();
        this.socket = null;

        this.disabledBtn(false);
      },

      pushData(data, item){
        if(data.length >= size){ data.shift(); }
        data.push(item);
      },
    },

    watch: {
      // wave: function(){
      //   console.log(this.wave);
      // },
      'modal.show': 'disableModal'
    },

    computed: {
      wavePointData: function(){
        const idx = this.wave;
        const tmp = this.yData[idx];
        this.pushData(this.waveData, tmp);
        return tmp;
      }
    },

    mounted() {
      this.wave = 1024;
      this.vPort = '1024';
      this.vHost = 'localhost';
      this.title[1] = 'Focus: ' + this.wave.toString();
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

  .data {
    padding: 10px 23px 10px 23px;
    /* padding-left: 20px; */
  }

  .btn {
    padding: 10px;
    text-align: right;
  }
</style>