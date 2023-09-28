<template>
  <vs-dialog
    prevent-close
    v-model="isVisible"
    @close="closeDialog" >
    <div style="width:500px;">
      <div class="ml-6 mr-6">
        <h2>Criar Grupo</h2>

        <!-- NOME DO GRUPO -->
        <vs-input
          block
          primary
          label="Nome do Grupo"
          class="mt-4"
          v-model="nome"
          id="inputgroup"
          @input="nomeErrors">
          <template
            #message-danger
            v-if="errosNome">
            {{ errosNome }}
          </template>
          <template
            #message-success
            v-if="informacoesNome">
            {{ informacoesNome }}
          </template>
        </vs-input>

        <!-- ADICIONAR CONTACTOS -->
        <vs-select
          block
          primary
          class="mt-4"
          label="Contactos"
          multiple
          filter
          collapse-chips
          v-model="selecionados"
          @input="contactosErrors">
          <template
            #message-success
            v-if="informacoesContactos">
            {{ informacoesContactos }}
          </template>
          <template
            #message-danger
            v-if="errosContactos">
            {{ errosContactos }}
          </template>

          <vs-option
            v-for="(contacto, i) in contactos"
            :key="i"
            :label="contacto.nome"
            :value="contacto">
            {{ contacto.nome }}
          </vs-option>
        </vs-select>

        <!-- ADICIONAR P/MAIL -->
        <!-- TODO add botão confirmar; espaço c/lista de mails; botão remover cada mail; -->
        <vs-select
          block
          primary
          class="mt-4"
          label="Contactos por email"
          multiple
          filter
          collapse-chips
          v-model="selecionadosEmail"
          @input="contactosErrors">
          <template
            #message-success
            v-if="informacoesContactos">
            {{ informacoesContactos }}
          </template>
          <template
            #message-danger
            v-if="errosContactos">
            {{ errosContactos }}
          </template>

          <vs-option
            v-for="(contacto, i) in contactosEmail"
            :key="i"
            :label="contacto.email"
            :value="contacto">
            {{ contacto.email }}
          </vs-option>
        </vs-select>
      </div>
    </div>

    <template #footer>
      <!-- CONFIRMAR E CANCELAR -->
      <vs-button
        @click="submit"
        :disabled="!canSubmit"
        success
        style="float:right;"
        class="mb-2"
        v-shortkey="['g']"
        @shortkey="!!canSubmit ? submit() : () => {}">
        <i class="fa-solid fa-check mr-2"></i>
        <span>Criar <u>G</u>rupo</span>
      </vs-button>
      <vs-button
        @click="closeDialog"
        style="float:right;"
        v-shortkey="['c']"
        @shortkey="closeDialog">
        <i class="fa-solid fa-xmark mr-2"></i>
        <u>C</u>ancelar
      </vs-button>
    </template>
  </vs-dialog>
</template>

<style lang="scss">
.vs-select__label {
  left: 24px !important;
}

.vs-select__chips__input {
  color: white;
}
</style>

<script lang="ts">
import Vue from 'vue';
import { Contacto } from '@/typings/typings';

export default Vue.extend({
  props: {
    isVisible: {
      type: Object as () => boolean,
    },
  },
  data: () => ({
    nome: '',
    txtEmail: '',
    selecionados: [],
    selecionadosEmail: [] as string[],
    errosNome: '',
    informacoesNome: '',
    errosEmail: '',
    informacoesEmail: '',
    errosContactos: '',
    informacoesContactos: '',
    contactos: [],
    contactosEmail: [],
  }),
  computed: {
    canSubmit() {
      return !this.errosNome && !this.informacoesNome && (this.selecionados.length || this.selecionadosEmail.length);
    },
  },
  beforeMount() {
    this.contactos = this.$store.state.contactos.recentes
      .filter((c: Contacto) => !c.grupo && !c.hidden)
      .sort((a: Contacto, b: Contacto) => {
        if (a.nome < b.nome) return -1;
        if (a.nome > b.nome) return 1;

        return 0;
      });

    this.contactosEmail = this.$store.state.contactos.recentes
      .filter((c: Contacto) => !c.grupo && !!c.email)
      .sort((a: Contacto, b: Contacto) => {
        if (a.nome < b.nome) return -1;
        if (a.nome > b.nome) return 1;

        return 0;
      });

    this.resetFields();
  },
  methods: {
    nomeErrors() {
      this.informacoesNome = '';
      if (!this.nome.length) this.errosNome = 'Nome obrigatório';
      else if (this.nome.length > 20) this.errosNome = 'Comprimento máximo: 20 caracteres';
      else if (this.$store.state.contactos.recentes.find((c: Contacto) => c.nome === this.nome)) this.errosNome = 'Já existe um grupo ou contacto com esse nome';
      else this.errosNome = '';
    },
    emailErrors() {
      this.informacoesEmail = '';
      if (!this.txtEmail.length) this.errosEmail = 'E-mail obrigatório';
      else if (this.txtEmail.length > 128) this.errosEmail = 'Comprimento máximo: 128 caracteres';
      else if (!this.emailValid(this.txtEmail)) this.errosEmail = 'Email inválido';
      else this.errosEmail = '';
    },
    contactosErrors() {
      this.informacoesContactos = '';
      if (!this.selecionados.length && !this.selecionadosEmail.length) this.errosContactos = 'Pelo menos um contacto obrigatório';
      else this.errosContactos = '';
    },
    submit() {
      this.$store.dispatch('contactos/createGroup', {
        nome: this.nome,
        contactos: [
          ...this.selecionados,
          ...this.selecionadosEmail,
        ],
      });

      this.resetFields();
      this.$emit('criado');
      this.closeDialog();
    },
    add() {
      this.selecionadosEmail.push(this.txtEmail);
    },
    resetFields() {
      this.nome = '';
      this.errosNome = '';
      this.informacoesNome = 'Nome obrigatório';
      this.txtEmail = '';
      this.errosEmail = '';
      this.informacoesEmail = 'Insira um email válido.';
      this.selecionados = [];
      this.errosContactos = '';
      this.informacoesContactos = 'Pelo menos um contacto obrigatório';
      this.selecionadosEmail = [];
    },
    closeDialog() {
      this.$emit('close');
    },
    emailValid(email: string) {
      return email.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
    },
  },
});
</script>
