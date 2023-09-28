<template>
  <div class="grid">
    <vs-row style="margin-bottom:0;padding-bottom:0;">
      <vs-col
        w="12"
        v-if="computedMensagens.length > 0"
        style="height:465px;overflow-y:scroll;overflow-x:hidden;"
        ref="mensagens">
          <!-- Zona onde está contida a mensagem -->
          <div>
            <Messages
              v-if="reRenderChat"
              :mensagens="computedMensagens" />
          </div>
      </vs-col>
      <vs-col
        w="8"
        v-else>
        <div class="p-grid p-jc-center p-ai-center vertical-container" style="width:100%;height:465px">
          <div class="grid" style="width:970px;height:100%">
            <vs-row align="center" justify="center" style="height:100%;">
              <vs-col w="4" v-show="!search">
                <i id="leftArrow" class="fa-solid fa-share fa-flip-vertical" data-fa-transform="rotate--90"></i>
              </vs-col>
              <vs-col w="5">
                <vs-alert relief>
                  <template #title>
                    <h1>Sem mensagens...</h1>
                  </template>

                  <p v-show="!search">
                    Envie uma mensagem ou inicie uma chamada para começar!
                    <i class="fa-solid fa-face-smile-wink twemoji ml-2" data-fa-transform="grow-16" />
                  </p>
                  <p v-show="search">
                    Sem mensagens encontradas para <i>"<strong>{{ search }}</strong>"</i>.
                  </p>
                </vs-alert>
              </vs-col>
              <vs-col w="1"></vs-col>
            </vs-row>
          </div>
        </div>
      </vs-col>

      <!-- ESPAÇO ESCREVER MENSAGEM -->
      <vs-col w="8">
        <vs-input
          block
          class="mt-1"
          @keypress="checkSubmit"
          v-model="mensagem"
          placeholder="Escreva uma mensagem..." />
      </vs-col>

      <!-- BOTÃO ENVIAR MENSAGEM -->
      <vs-col w="4">
        <vs-button
          style="float:left;"
          :disabled="mensagem === ''"
          @click="enviarMensagem"
          class="p-mr-1">
          <i class="fa-solid fa-paper-plane mr-2"></i>
          Enviar
        </vs-button>

        <!-- BOTÃO ESCOLHER FICHEIRO -->
        <div style="float:left;">
          <label for="ficheiroInput">
            <vs-button
              v-shortkey="['f']"
              @shortkey="openFileExplorer"
              @click="openFileExplorer">
              <i class="fa-solid fa-paperclip mr-2"></i>
              <u>F</u>icheiro
            </vs-button>
          </label>
          <input
            @change="uploadFicheiro"
            type="file"
            ref="fileUpload"
            style="display:none;" />
        </div>
        <!-- BOTAO DE JOGOS -->
        <vs-button
          style="float:left;height:36px;"
          icon
          v-shortkey="['j']"
          @shortkey="openDialogJogos"
          @click="openDialogJogos">
          <i class="fa fa-gamepad mr-2" style="font-size:20px"></i>
          <u>J</u>ogos
        </vs-button>
      </vs-col>
    </vs-row>

    <Jogos
      :chat="chat"
      :isVisible.sync="dialogJogos"
      @close="closeDialogJogos"
      @iniciado="descerMensagem" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Messages from '@/components/Messages.vue';
import { Mensagem, Contacto } from '@/typings/typings';
import Jogos from '@/components/dialogs/Jogos.vue';

export default Vue.extend({
  components: {
    Jogos,
    Messages,
  },
  props: {
    chat: {
      type: Object as () => Contacto,
    },
    search: {
      type: Object as () => string,
    },
  },
  watch: {
    chat: {
      immediate: true,
      handler() {
        this.forceRerenderChat();
        this.descerMensagem();
      },
    },
  },
  data: () => ({
    dialogJogos: false,
    reRenderChat: true,
    ficheirosDisplay: false,
    mensagem: '',
    ficheiro: null,
  }),
  mounted() {
    this.descerMensagem();
  },
  computed: {
    computedMensagens(): Mensagem[] {
      const chat = this.getChat();
      if (!chat || !chat.mensagens) return [];
      if (!this.search) return chat.mensagens;
      return chat.mensagens.filter((m: Mensagem) => (m.texto ? m.texto.toLowerCase().includes(this.search.toLowerCase()) : false));
    },
  },
  methods: {
    openDialogJogos() {
      this.dialogJogos = true;
    },
    closeDialogJogos() {
      this.dialogJogos = false;
    },
    openFileExplorer() {
      (this.$refs.fileUpload as HTMLInputElement).click();
    },
    forceRerenderChat() {
      this.reRenderChat = false;

      this.$nextTick().then(() => {
        this.reRenderChat = true;
      });
    },
    getChat(): Contacto | null {
      return this.$store.state.contactos.recentes.find((r: Contacto) => r.nome === this.chat.nome);
    },
    uploadFicheiro({ target: { files } }: unknown) {
      this.$store.dispatch('contactos/sendMessage', {
        chat: this.chat,
        mensagem: {
          autor: '$$user$$',
          ficheiro: files[0].name,
          momento: new Date(),
        } as Mensagem,
      });

      this.$emit('messageSent');

      this.descerMensagem();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this.$refs.fileUpload as HTMLInputElement).value = '';
    },
    openFicheirosDialog() {
      this.ficheirosDisplay = true;
    },
    cancelFicheirosDialog() {
      this.ficheirosDisplay = false;
      return null;
    },
    submitFicheirosDialog() {
      this.ficheirosDisplay = false;
      return null;
    },
    checkSubmit({ code }: KeyboardEvent) {
      if (code === 'Enter') this.enviarMensagem();
    },
    enviarMensagem() {
      if (this.mensagem === '') return;

      this.$store.dispatch('contactos/sendMessage', {
        chat: this.chat,
        mensagem: {
          autor: '$$user$$',
          texto: this.mensagem,
          momento: new Date(),
        } as Mensagem,
      });

      if (this.chat.nome === 'Twix') {
        // No caso da pessoa mudar de chat
        const chatCpy = { ...this.chat };
        setTimeout(() => {
          this.$store.dispatch('contactos/sendMessage', {
            chat: chatCpy,
            mensagem: {
              autor: 'Twix',
              texto: 'aoao',
              momento: new Date(),
            } as Mensagem,
          });

          if (this.chat.nome === 'Twix') { this.descerMensagem(); }
        }, 5 * 1000);
      }

      this.$emit('messageSent');

      this.mensagem = '';

      this.descerMensagem();
    },
    descerMensagem(): void {
      setTimeout(() => {
        const el = this.$refs.mensagens as Vue;
        if (el?.$el.firstElementChild?.firstElementChild?.lastElementChild?.lastElementChild?.lastElementChild) {
          el.$el.firstElementChild.firstElementChild.lastElementChild.lastElementChild.lastElementChild.scrollIntoView();
        }
      }, 50);
    },
  },
});
</script>
