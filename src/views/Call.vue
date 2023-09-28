<template>
  <div class="grid" justify="center">
    <vs-row>
      <vs-col w="12">
        <div style="width:100%;height:465px;">
          <div class="dish" style="height:429px;overflow-y:scroll;">
            <div
              class="participant mr-3 mb-3"
              v-for="(contacto, i) in emChamada"
              :key="i">
              <vs-card
                class="participantCard">
                <template #img>
                  <img
                    :src="require(`../assets/${getContactoImage(contacto.nome)}`)"
                    :width="297"
                    :height="165"
                    :style="{
                      'background-image': `${contacto.imagem && contacto.background ? `url('${require(`../assets/${contacto.background}`)}')` : ''}`,
                      'background-size': '100% 100%'}"
                    />
                </template>
                <template #interactions>
                  <vs-button
                    class="no-hover"
                    v-if="contacto.nome === '$$user$$' ? !userVideo : !contacto.camera"
                    danger
                    icon
                    flat
                    relief>
                    <i class="fa-solid fa-video-slash"></i>
                  </vs-button>

                  <vs-button
                    class="no-hover"
                    v-if="contacto.nome === '$$user$$' ? !userMicro : !contacto.micro"
                    danger
                    icon
                    flat
                    relief>
                    <i class="fa-solid fa-microphone-slash"></i>
                  </vs-button>

                  <h4>{{ parseNome(contacto.nome) }}</h4>
                </template>
              </vs-card>
            </div>
          </div>
        </div>
      </vs-col>
      <vs-col w="12">
        <div class="grid p-jc-center">
          <vs-row justify="center" align="center">
            <div
              v-shortkey="['r']"
              @shortkey="userVideo = !userVideo; toggleUserVideo()">
              <vs-switch
                v-model="userVideo"
                @click="toggleUserVideo"
                class="mr-2">
                <template #on>
                  <i class="fa-solid fa-video mr-2" />
                  Câma<u>r</u>a
                </template>
                <template #off>
                  <i class="fa-solid fa-video-slash mr-2" />
                  Câma<u>r</u>a
                </template>
              </vs-switch>
            </div>

            <div
              v-shortkey="['m']"
              @shortkey="userMicro = !userMicro; toggleUserMicro()">
              <vs-switch
                v-model="userMicro"
                @click="toggleUserMicro"
                class="mr-1">
                <template #on>
                  <i class="fa-solid fa-microphone mr-2" />
                  <u>M</u>icrofone
                </template>
                <template #off>
                  <i class="fa-solid fa-microphone-slash mr-2" />
                  <u>M</u>icrofone
                </template>
              </vs-switch>
            </div>

            <vs-button
              @click="openDialogFundos"
              v-shortkey="['f']"
              @shortkey="openDialogFundos">
              <i class="fa-solid fa-tv mr-2"></i>
              <u>F</u>undos
            </vs-button>

            <vs-button
              @click="openDialogSoundboard"
              v-shortkey="['s']"
              @shortkey="openDialogSoundboard">
              <i class="fa-solid fa-volume-high mr-2"></i>
              <u>S</u>ons
            </vs-button>
          <!-- </vs-row>
        </div>
      </vs-col>

      <vs-col w="12">
        <div class="grid">
          <vs-row justify="center"> -->
            <vs-button
              danger
              @click="leaveCall">

              <i class="fa-solid fa-phone-slash mr-2" data-fa-transform="rotate-90"></i>
              Terminar
            </vs-button>
          </vs-row>
        </div>
      </vs-col>
    </vs-row>

    <AlterarFundo
      :isVisible.sync="dialogFundos"
      @close="closeDialogFundos" />

    <Soundboard
      :chat="chat"
      :isVisible.sync="dialogSoundboard"
      @close="closeDialogSoundboard" />
  </div>
</template>

<style lang="scss" scoped>
.vs-switch {
  height: 34px;
}

.vs-card__interactions h4 {
  text-shadow: 0 0 10px black;
}

.participantCard,.vs-card,.vs-card__image {
  border: none !important;
  box-shadow: none !important;
}

.dish {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  position: absolute;
  left: 0px;
  bottom: 0px;
  top: 0px;
  right: 0px;

  div {
    position: relative;
    vertical-align: middle;
    align-self: center;
    border-radius: 10px;
    display: inline-block;
  }

  img {
    color: none;
    background: none;
  }
}
</style>

<script lang="ts">
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import Vue from 'vue';
import { ParticipanteChamada, Contacto } from '@/typings/typings';
import AlterarFundo from '@/components/dialogs/AlterarFundo.vue';
import Soundboard from '@/components/dialogs/Soundboard.vue';

export default Vue.extend({
  components: {
    AlterarFundo,
    Soundboard,
  },
  props: {
    chat: {
      type: Object as () => Contacto,
    },
  },
  data: () => ({
    userVideo: true,
    userMicro: true,
    dialogFundos: false,
    dialogSoundboard: false,
    loadedImages: {} as Record<string, boolean>,
  }),
  computed: {
    emChamada(): ParticipanteChamada[] {
      if (!this.chat.naChamada?.length) return [];
      return [...this.chat.naChamada, this.$store.state.user.chamada];
    },
  },
  watch: {
    chat: {
      immediate: true,
      handler(val: Contacto, oldVal: Contacto) {
        // Go to chat if changes from one chat to another
        if (val != null && oldVal != null) {
          this.$router.push({ name: 'Chat' });
          return;
        }

        this.resetLoadedImages();
      },
    },
  },
  beforeMount() {
    this.userVideo = !!this.$store.state.user.chamada.imagem;
    this.userMicro = this.$store.state.user.chamada.micro;
  },
  methods: {
    getContactoImage(nome: string) {
      if (nome === '$$user$$') return this.$store.state.user.chamada.imagem || this.$store.getters['contactos/getAvatar'](nome);
      return this.$store.getters['contactos/getCamera'](nome, this.chat.nome) || this.$store.getters['contactos/getAvatar'](nome);
    },
    parseNome(nome: string) {
      return nome.replace('$$user$$', this.$store.state.user.contacto.nome);
    },
    toggleUserVideo() {
      this.$store.dispatch('user/toggleImage');
      this.$emit('cameraUpdate');
    },
    toggleUserMicro() {
      this.$store.dispatch('user/toggleMicro');
    },
    setLoadedImage(nome: string) {
      this.$set(this.loadedImages, nome, true);
    },
    resetLoadedImages() {
      this.loadedImages = {};
    },
    leaveCall() {
      this.$store.dispatch('contactos/setLastCallDuration', this.chat);

      this.$emit('callEnd');
      this.$store.dispatch('user/leaveCall');
      this.$router.push({ name: 'Chat' });
    },
    openDialogFundos() {
      this.dialogFundos = true;
    },
    closeDialogFundos() {
      this.dialogFundos = false;
    },
    openDialogSoundboard() {
      this.dialogSoundboard = true;
    },
    closeDialogSoundboard() {
      this.dialogSoundboard = false;
    },
  },
});
</script>
