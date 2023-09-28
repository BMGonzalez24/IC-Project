<template>
  <div class="grid">
    <vs-row
      style="height:720px;"
      justify="center"
      align="center">
      <vs-col w="4">
        <vs-alert
          color="rbg(255,255,255)"
          style="height:180px;">
          <template #title>
            Identificação
          </template>

          <!-- <small class="ml-1">Nome de utilizador</small> -->
          <vs-input
            ref="inpNome"
            v-model="nome"
            @keypress="checkSubmit"
            @input="checkErro"
            class="mt-3"
            block
            icon-before
            label-placeholder="Nome de utilizador">
            <template #icon>
              <i class="fa-solid fa-user"></i>
            </template>

            <template #message-danger v-if="erro" class="mb-0">
              {{ erro }}
            </template>
            <template #message-success v-if="informacao" class="mb-0">
              {{ informacao }}
            </template>
          </vs-input>

          <vs-button
            color="primary"
            :disabled="!!erro || !!informacao"
            @click="iniciarSessao"
            class="ml-0"
            v-shortkey="['c']"
            @shortkey="!erro && !informacao ? iniciarSessao() : () => {}">
            <u>C</u>ontinuar
          </vs-button>
        </vs-alert>
      </vs-col>
    </vs-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    nome: '',
    erro: '',
    informacao: 'Nome obrigatório',
  }),
  beforeCreate() {
    // Limpar sessionStorage. é por domínio, portanto não queremos lixo de outros projetos
    sessionStorage.clear();
  },
  mounted() {
    if (sessionStorage.getItem('user')) {
      this.nome = this.$store.state.user.contacto.nome;
      this.erro = '';
    }

    const inp = (this.$refs.inpNome as Vue).$el.querySelector('input');
    if (inp) { inp.focus(); }
  },
  methods: {
    iniciarSessao() {
      this.$store.dispatch('user/setUsername', this.nome);
      this.$router.push({ name: 'Chat' });
    },
    checkSubmit({ code }: KeyboardEvent) {
      if (code === 'Enter' && !this.erro) this.iniciarSessao();
    },
    checkErro() {
      this.informacao = '';
      if (!this.nome) this.erro = 'Nome obrigatório';
      else if (this.nome.length > 20) this.erro = 'Comprimento máximo: 20 caracteres';
      else this.erro = '';
    },
  },
});
</script>
