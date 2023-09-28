<template>
  <vs-dialog
    prevent-close
    v-model="isVisible"
    @close="closeDialog">
    <div style="width:375px;">
      <div class="ml-5">
        <h2 center>Jogos</h2>
      </div>

      <p class="ml-5">Diferentes jogos a serem jogados</p>
      <div class="grid">
        <vs-row justify="center" align="center">
          <vs-col
            w="5"
            v-for="(imagem, i) in imagensJogo"
            :key="i">
            <vs-tooltip>
              <img
                @click="() => imagemClick(imagem)"
                :class="`${imagem.ativo ? 'imgselecionada' : ''} rounded-corners`"
                :src="require(`../../assets/${imagem.href}`)"
                width="150px"
                height="150px"/>

              <template #tooltip>
                {{ imagem.tooltip }}
              </template>
            </vs-tooltip>
          </vs-col>
        </vs-row>
      </div>
      <small
        v-if="!jogoAtivo"
        class="ml-5"
        id="msgErroJogos">
        Jogo obrigatório
      </small>

      <div v-if="chat.grupo">
        <p class="ml-5">Escolha um elemento do grupo</p>
        <div class="grid">
          <vs-select
            class="ml-5 mr-6"
            style="min-width:300px;max-width:300px;"
            v-model="selecionado"
            primary
            @change="errosSelecionado">
            <template
              #message-success
              v-if="informacoesSelecionado">
              {{ informacoesSelecionado }}
            </template>
            <template
              #message-danger
              v-if="erroSelecionado">
              {{ erroSelecionado }}
            </template>

            <vs-option
              v-for="(contacto, i) in contactos"
              :key="i"
              :label="contacto.nome"
              :value="contacto.nome">
              {{ contacto.nome }}
            </vs-option>
          </vs-select>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="grid" style="width:100%;">
        <vs-row class="ml-6">
          <vs-col offset="3" w="8">
            <div style="margin-left:12px">
              <vs-button
                style="float:left;"
                @click="closeDialog"
                v-shortkey="['c']"
                @shortkey="closeDialog">
                <i class="fa-solid fa-xmark mr-2"></i>
                <u>C</u>ancelar
              </vs-button>
              <vs-button
                style="float:left;"
                success
                :disabled="!jogoAtivo || !selecionado"
                @click="submeter"
                v-shortkey="['j']"
                @shortkey="jogoAtivo && selecionado ? submeter() : () => {}">
                <i class="fa-solid fa-check mr-2"></i>
                <u>J</u>ogar
              </vs-button>
            </div>
          </vs-col>
        </vs-row>
      </div>
    </template>
  </vs-dialog>
</template>

<style lang="scss" scoped>
.imgselecionada {
  border: 2px rgb(var(--vs-danger)) solid;
}

#msgErroJogos {
  font-size: 11.2px;
  color: rgb(var(--vs-success));
  margin-left:6px;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { Contacto, Mensagem, ParticipanteChamada } from '@/typings/typings';

export default Vue.extend({
  props: {
    isVisible: {
      type: Object as () => boolean,
    },
    chat: {
      type: Object as () => Contacto,
    },
  },
  data: () => ({
    imagensJogo: [
      {
        href: 'img/jogos/4linha.png',
        ativo: false,
        tooltip: '4 em Linha',
      },
      {
        href: 'img/jogos/damas.jpg',
        ativo: false,
        tooltip: 'Damas',
      },
      {
        href: 'img/jogos/galo.png',
        ativo: false,
        tooltip: 'Jogo do Galo',
      },
      {
        href: 'img/jogos/xadrez.png',
        ativo: false,
        tooltip: 'Xadrez',
      },
    ],
    selecionado: '',
    erroSelecionado: '',
    informacoesSelecionado: '',
    contactos: [] as ParticipanteChamada[],
  }),
  computed: {
    jogoAtivo(): { tooltip: string, href: string, ativo: boolean } | undefined {
      return this.imagensJogo.find((i) => i.ativo);
    },
  },
  watch: {
    chat: {
      immediate: true,
      handler(newChat) {
        this.contactos = newChat.naChamada
          .sort((a: ParticipanteChamada, b: ParticipanteChamada) => {
            if (a.nome < b.nome) return -1;
            if (a.nome > b.nome) return 1;

            return 0;
          });

        this.resetFields();
        if (this.contactos.length === 1) {
          this.selecionado = this.contactos[0].nome;
          this.erroSelecionado = '';
        }
      },
    },
  },
  methods: {
    errosSelecionado() {
      this.informacoesSelecionado = '';
      if (!this.selecionado) this.erroSelecionado = 'Contacto obrigatório';
      else this.erroSelecionado = '';
    },
    resetFields() {
      this.selecionado = '';
      this.erroSelecionado = '';
      this.informacoesSelecionado = 'Contacto obrigatório';

      for (let i = 0; i < this.imagensJogo.length; i += 1) { this.imagensJogo[i].ativo = false; }
    },
    imagemClick(imagem: { href: string, ativo: boolean }): void {
      // Meter imagem ativa
      for (let i = 0; i < this.imagensJogo.length; i += 1) {
        if (this.imagensJogo[i].href === imagem.href) {
          this.imagensJogo[i].ativo = true;
        } else {
          this.imagensJogo[i].ativo = false;
        }
      }
    },
    contactosErrors() {
      if (!this.selecionado) this.erroSelecionado = 'Contacto obrigatório';
      else this.erroSelecionado = '';
    },
    closeDialog(): void {
      this.resetFields();
      this.$emit('close');
    },
    submeter() {
      const jogo = this.jogoAtivo;
      this.$store.dispatch('contactos/sendMessage', {
        chat: this.chat,
        mensagem: {
          autor: 'Jogo',
          texto: `<strong>${this.$store.state.user.contacto.nome}</strong> começou um jogo de <strong>${jogo?.tooltip}</strong> com <strong>${this.selecionado}</strong>.`,
          momento: new Date(),
          imagem: jogo?.href,
          sistema: true,
        } as Mensagem,
      });

      this.$emit('iniciado');
      this.closeDialog();
      this.resetFields();
    },
  },
});
</script>
