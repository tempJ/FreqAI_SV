<template>
  <v-overlay
  :value="isShow"
  >
    <v-expand-transition>
      <v-alert
      class="modal"
      border="left"
      :type="type"
      elevation="2"
      v-if="isShow"
      >
        {{ msg }}
      </v-alert>
    </v-expand-transition>
  </v-overlay>
</template>

<script>
  export default {
    props: {
      show: Boolean,
      type: String,
      msg: String
    },
    name: 'OverlayModal',

    data: () => ({
      isShow: false
    }),

    methods: {
      // displayModal(){
      //   this.modal.type = type;
      //   this.modal.msg = msg;
      //   this.show = !this.show;
      //   this.overlay = !this.overlay;
      //   return -1;
      // },

      disableModal(){
        setTimeout(() => { this.show = false; }, 3000);
      },
    },

    watch: {
      show(val){
        // console.log(val)
        if(val){
          this.isShow = true;
          setTimeout(() => {
            this.isShow = false;
          }, 3000);
        }
      },
      // overlay(val){
      //   val && setTimeout(() => {
      //     this.overlay = false;
      //   }, 3000);
      // },
    },
  }
</script>

<style scoped>
  .modal{
    width: 90vw;
    position: fixed;
    z-index: 1024;
    left: 4vw;
    bottom: 10px;
  }
</style>