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

          <!-- <v-btn
          icon
          :color="saveColor"
          :disabled="saveDisabled"
          @click="saveData"
          >
            <v-icon>save</v-icon>
          </v-btn> -->
          
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
          :color="getColor"
          :disabled="getDisabled"
          @click="getData"
          >
            <v-icon>{{ getIcon }}</v-icon>
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
      save: Array,
      hold: Boolean,
    },

    name: 'ToolBar',

    data: () => ({
      draggable: false,

      initColor: 'success',
      
      getColor: 'success',
      getIcon: 'play_arrow',

      saveColor: 'primary',

      chDisabled: true,
      // getDisabled: true,
      getDisabled: true,
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
        // this.getDisabled = isTrue;
        this.getDisabled = isTrue;
        this.saveDisabled = isTrue;
      },

      startGet(isStop = true){
        if(isStop){
          this.getColor = 'error';
          this.getIcon = 'stop';
        }
        else{
          this.getColor = 'success';
          this.getIcon = 'play_arrow';
        }
      },

      // startSave(isSave = true){
      //   if(isSave){
      //     this.saveColor = 'error';
      //   }
      //   else{
      //     this.saveColor = 'primary';
      //   }
      // },

      async initChannel(){
        if(this.initColor === 'success'){
          this.$emit("init", true);
          this.initToolbar(false);
        }
        else{
          // console.log('d')
          this.$emit("init", false);
          this.initToolbar();
          // console.log('s')
        }
      },

      // async getData(){
      //   this.get = true;
      // },

      async getData(){
        if(this.getColor === 'error'){
          this.$emit("get", false);
          this.startGet(false);
        }
        else{
          this.$emit("get", true);
          this.startGet();
        }
      },

      // saveData(){
      //   if(this.saveColor === 'error'){
      //     this.$emit("save", false);

      //     const filePath = './saveData';
      //     const fileName = Math.round(new Date().getTime() / 1000);
      //     const data = this.save.join('\r\n');

      //     fs.mkdir(`${filePath}`, () => {
      //       fs.writeFile(`${filePath}/${fileName}.csv`, data, (err) => {
      //         if(err !== null){ return -1; }
      //         this.startSave(false);
      //       });
      //     });
      //   }
      //   else{
      //     this.$emit("save", true);
      //     this.startSave();
      //   }
      // },

      // saveFile(){
      //   if(hold){

      //   }
      // }
    },
    watch: {
      channel: function(){
        this.$emit("chIdx", this.chList.indexOf(this.channel));
      },
      // hold: function(val){
      //   if(val){

      //   }
      //   else{
      //     const filePath = './saveData';
      //     const fileName = Math.round(new Date().getTime() / 1000);
      //     const data = this.save.join('\r\n');

      //     fs.mkdir(`${filePath}`, () => {
      //       fs.writeFile(`${filePath}/${fileName}.csv`, data, (err) => {
      //         if(err !== null){ return -1; }
      //         this.startSave(false);
      //       });
      //     });
      //   }
      // }
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