<template>
  <vs-dialog
    v-model="isVisible"
    @close="closeDialog">
    <div class="ml-6 mr-6">
      <h2>Aceleradores</h2>
    </div>

    <div class="grid">
      <vs-row
        primary
        justify="center"
        align="center">
        <vs-col
          v-for="(keybind, i) in keybinds"
          :key="i"
          w="5"
          class="bg-darker p-3 my-5 rounded-corners"
          :offset="i % 2">

          <h4>{{ keybind.titulo }}</h4>
          <small v-if="keybind.excecao">
            {{ keybind.excecao }}
          </small>

          <div style="display:flex">
            <vs-button
              v-for="(key, j) in keybind.keys"
              :key="j"
              relief
              class="no-hover">
              <span v-if="!key.startsWith('fa')">{{ key }}</span>
              <i v-else :class="`fa-solid ${key}`"></i>
            </vs-button>
          </div>
        </vs-col>
      </vs-row>
    </div>
  </vs-dialog>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isVisible: {
      type: Object as () => boolean,
    },
  },
  data: () => ({
    keybinds: [
      // Geral
      { keys: ['C'], titulo: 'Cancelar', excecao: 'Apenas quando um pop-up está visível' },

      // Navbar
      { keys: ['F1'], titulo: 'Ajuda' },
      { keys: ['Ctrl', 'G'], titulo: 'Criar grupo' },

      // Navbar -> Criar grupo
      { keys: ['G'], titulo: 'Confirmar criar grupo', excecao: 'Apenas no pop-up criar grupo' },

      // ChatContainer
      { keys: ['A'], titulo: 'Chamada de áudio', excecao: 'Apenas numa conversa' },
      { keys: ['V'], titulo: 'Chamada de vídeo', excecao: 'Apenas numa conversa' },
      { keys: ['R'], titulo: 'Retornar à chamada', excecao: 'Apenas numa conversa durante uma chamada' },

      // ChatContainer -> Overwrite chamada
      { keys: ['O'], titulo: 'Entrar numa nova chamada', excecao: 'Apenas no pop-up de confirmação de troca de chamada' },
      { keys: ['Ctrl', 'fa-arrow-up'], titulo: 'Contacto anterior' },
      { keys: ['Ctrl', 'fa-arrow-down'], titulo: 'Contacto posterior' },

      // Chat
      { keys: ['F'], titulo: 'Enviar ficheiro', excecao: 'Apenas numa conversa' },
      { keys: ['J'], titulo: 'Jogos', excecao: 'Apenas numa conversa' },

      // Call
      { keys: ['R'], titulo: 'Ligar/desligar câmara', excecao: 'Apenas numa chamada' },
      { keys: ['M'], titulo: 'Ligar/desligar microfone', excecao: 'Apenas numa chamada' },
      { keys: ['F'], titulo: 'Fundos', excecao: 'Apenas numa chamada' },
      { keys: ['S'], titulo: 'Sons', excecao: 'Apenas numa chamada' },
      { keys: ['V'], titulo: 'Voltar à conversa', excecao: 'Apenas numa chamada' },

      // Call -> Aplicar fundo
      { keys: ['A'], titulo: 'Aplicar fundo', excecao: 'Apenas no pop-up alterar fundo' },
      { keys: ['R'], titulo: 'Repor fundo', excecao: 'Apenas no pop-up alterar fundo' },

      // Call -> Sons
      { keys: ['P'], titulo: 'Parar sons', excecao: 'Apenas no pop-up sons' },
      { keys: ['+'], titulo: 'Aumentar sons', excecao: 'Apenas no pop-up sons' },
      { keys: ['-'], titulo: 'Diminuir sons', excecao: 'Apenas no pop-up sons' },
      { keys: ['T'], titulo: 'Tocar som', excecao: 'Apenas no pop-up sons' },

      // Help
      { keys: ['V'], titulo: 'Voltar atrás', excecao: 'Apenas na página de ajuda' },
      { keys: ['A'], titulo: 'Aceleradores', excecao: 'Apenas na página de ajuda' },
    ] as {keys: string[], titulo: string, excecao?: string }[],
  }),
  methods: {
    submit() {
      // this.$store.dispatch('contactos/createGroup', { nome: this.nome, contactos: this.selecionados });

      this.$emit('signout');
      this.closeDialog();
    },
    closeDialog() {
      this.$emit('close');
    },
  },
});
</script>
