<template droppable="true">
    <v-container>
      <!-- <div
      @dragover="dragOver"
      @drop="dropOn"
      > -->
      <v-card
      id="toolbar"
      flat
      tile
      :draggable="draggable"
      @dragstart="dragStart"
      >
        <v-toolbar
        elevation="2"
        dense
        >
          <v-btn
          icon
          plain
          width="20px"
          color="secondary"
          draggable="true"
          @dragstart="draggable = true"
          @drag="draggable = true"
          @dragend="draggable = false"
          >
            <v-icon>drag_indicator</v-icon>
          </v-btn>
          <v-btn
          icon
          :color="initColor"
          @click="initChannel"
          >
            <v-icon>settings_power</v-icon>
          </v-btn>
          <v-btn
          icon
          :color="saveColor"
          :disabled="saveDisabled"
          @click="saveData"
          >
            <v-icon>save</v-icon>
          </v-btn>
          
          <v-divider
          inset
          vertical
          ></v-divider>
          
          <div id="select">
            <v-select
            dense
            draggable="false"
            :disabled="chDisabled"
            :items="chList"
            :label="chLabel"
            v-model="channel"
            ></v-select>
          </div>
          <!-- <v-btn
          color="success"
          icon
          :disabled="getDisabled"
          @click="getData"
          >
            <v-icon>show_chart</v-icon>
          </v-btn> -->
          <v-btn
          icon
          :color="getsColor"
          :disabled="getsDisabled"
          @click="getDatas"
          >
            <v-icon>{{ getsIcon }}</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card>
      <!-- </div> -->
    </v-container>
</template>

<script>
import fs from 'fs';

  export default {
    props: {
      channel: String,
      chList: Array,
      saveDatas: Array
    },

    name: 'ToolBar',

    data: () => ({
      draggable: false,

      initColor: 'success',
      
      getsColor: 'success',
      getsIcon: 'play_arrow',

      saveColor: 'primary',

      chDisabled: true,
      getDisabled: true,
      getsDisabled: true,
      saveDisabled: true,

      chLabel: 'Channel',
    }),

    methods: {
      // Toolbar drag and drop
      dragStart(e){
        const target = e.target.parentElement.parentElement.parentElement;
        const targetId = target.id;
        e.dataTransfer.setDragImage(target, 27, 25);
        e.dataTransfer.setData('targetId', targetId);

        const obj = document.getElementById(targetId);
        const shiftX = e.clientX - obj.getBoundingClientRect().left;
        const shiftY = e.clientY - obj.getBoundingClientRect().top;
        e.dataTransfer.setData('shiftX', shiftX);
        e.dataTransfer.setData('shiftY', shiftY);
      },

      // Initialization
      initToolbar(isTrue = true){
        if(isTrue){
          this.initColor = 'success';
          this.chLabel = 'Channel';
        }
        else{
          this.initColor = 'error';
          this.chLabel = null;
        }

        this.chDisabled = isTrue;
        this.getDisabled = isTrue;
        this.getsDisabled = isTrue;
        this.saveDisabled = isTrue;
      },

      startGets(isStop = true){
        if(isStop){
          this.getsColor = 'error';
          this.getsIcon = 'stop';
        }
        else{
          this.getsColor = 'success';
          this.getsIcon = 'play_arrow';
        }
      },

      startSave(isSave = true){
        if(isSave){
          this.saveColor = 'error';
        }
        else{
          this.saveColor = 'primary';
        }
      },

      async initChannel(){
        if(this.initColor === 'success'){
          this.$emit("init", true);
          this.initToolbar(false);
        }
        else{
          this.$emit("init", false);
          this.initToolbar();
        }
      },

      async getData(){
        this.get = true;
      },

      async getDatas(){
        if(this.getsColor === 'error'){
          this.$emit("gets", false);
          this.startGets(false);
        }
        else{
          this.$emit("gets", true);
          this.startGets();
        }
      },

      saveData(){
        if(this.saveColor === 'error'){
          this.$emit("save", false);

          const filePath = './saveData';
          const fileName = Math.round(new Date().getTime() / 1000);
          const data = this.saveDatas.join(',');

          fs.mkdir(`${filePath}`, () => {
            fs.writeFile(`${filePath}/${fileName}.csv`, data, (err) => {
              if(err !== null){ return -1; }
              this.startSave(false);
            });
          });

          
        }
        else{
          this.$emit("save", true);
          this.startSave();
        }
      },
    },
    watch: {
      channel: function(){
        this.$emit("chIdx", this.chList.indexOf(this.channel));
      }
    }
  }
</script>

<style scoped>
  #toolbar{
    position: fixed;
    left: 270px;
    top: 10px;
    z-index: 1022;
    background-color: rgba(255, 255, 255, 0);
  }
  #select{
    margin: 0px 0px 0px 10px;
    padding: 10px 10px 0px 10px;
    width: 120px;
  }
</style>