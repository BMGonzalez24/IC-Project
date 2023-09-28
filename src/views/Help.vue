<template>
  <div>
    <NavBar style="height:66px;" class="mb-2" />
    <div
      class="mr-1">
      <div class="grid p-3">
        <vs-row>
          <vs-col w="3" class="ml-6">
            <div style="display:flex;">
              <vs-button
                v-shortkey="['v']"
                @shortkey="goBack"
                @click="goBack"
                transparent
                style="flex: 0 0 44px;height:44px;">
                <i class="fa-solid fa-angles-left" data-fa-transform="grow-18"></i>
              </vs-button>
              <vs-button
                @click="openDialogKeybinds"
                v-shortkey="['a']"
                @shortkey="openDialogKeybinds">
                <i class="fa-solid fa-keyboard mr-2"></i>
                <u>A</u>celeradores
              </vs-button>
            </div>
          </vs-col>
        </vs-row>
        <!-- style="height:200px;" -->
        <!-- style="overflow-y:auto;height:200px" -->
        <vs-row
          style="max-height:550px;height:550px;overflow-y:auto;"
          justify="center"
          align="center">
          <!-- Inicio de sessao -->
          <vs-col
            class="bg-darker p-3 my-5 rounded-corners"
            w="5"
            v-for="(help, i) in filteredHelp"
            :key="i"
            :offset="i % 2">
            <h1>{{ help.titulo }}</h1>

            <p
              v-for="(p, i) in help.descricao"
              :key="i">
            {{ p }}
            </p>

            <img
              v-if="help.imagem"
              :src="require(`../assets/${help.imagem}`)" />
          </vs-col>
        </vs-row>
      </div>

    </div>
    <Keybinds
      :isVisible.sync="dialogKeybinds"
      @close="closeDialogKeybinds" />
  </div>
</template>

<style lang="scss" scoped>
img {
  width: 100%;
  max-width: 480px;
  float: left;
  clear: both;
}
</style>

<script lang="ts">
import Vue from 'vue';
import NavBar from '@/components/NavBar.vue';
import Keybinds from '@/components/dialogs/Keybinds.vue';

export default Vue.extend({
  components: {
    NavBar, Keybinds,
  },
  computed: {
    filteredHelp() {
      return this.helps.filter((h) => h.paginaBefore === this.$route.params.p);
    },
  },
  data: () => ({
    dialogKeybinds: false,
    helps: [
      // Chat
      {
        paginaBefore: 'Chat', titulo: 'Chat', descricao: ['Para aceder a uma conversa basta clicar num contacto.'], imagem: 'img/help/chat/selecionar_contacto.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Pesquisar contactos', descricao: ['Pesquise ao escrever o nome no campo de texto ou filtre os grupos através do botão que se encontra em cima da pesquisa de contactos.'], imagem: 'img/help/chat/pesquisa_contacto.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Enviar mensagem', descricao: ['Após selecionar uma conversa, no campo de texto escreva a sua mensagem e carregue no enviar.'], imagem: 'img/help/chat/envio_mensagem.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Enviar ficheiro', descricao: ['Carregar no botão "Ficheiro" e escolher do explorador de ficheiros do seu computador o ficheiro que pretende enviar.'], imagem: 'img/help/chat/envio_ficheiros.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Iniciar jogo', descricao: ['1. Numa conversa, carregar no botão "Jogos";', '2. Escolher o jogo a pessoa com quem quer jogar, e carregar no botão "Confirmar" para iniciar o jogo.'], imagem: 'img/help/chat/jogos.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Criar grupo', descricao: ['1. Carregar no botão "Criar Grupo" junto à pesquisa de contactos;', '2. Escrever o nome do novo grupo;', '3. Selecione os contactos que tem registados na sua lista de contactos carregando no campo seguinte;', '4. Adicionar através de email os contactos que não tenha adicionados.', 'No final deve carregar em "Confirmar" para criar o grupo.'], imagem: 'img/help/chat/criar_grupo.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Iniciar chamada', descricao: ['Numa conversa, carregar no botão "Áudio" ou "Vídeo".', 'Caso já se encontre numa chamada, pode terminá-la através do botão "Continuar".'], imagem: 'img/help/chat/iniciar_chamada.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Retomar chamada', descricao: ['Numa conversa, para retomar uma chamada, basta carregar no botão "Retomar".'], imagem: 'img/help/chat/retomar_chamada.gif',
      },
      {
        paginaBefore: 'Chat', titulo: 'Terminar chamada', descricao: ['Numa conversa, para retomar uma chamada, basta carregar no botão "Terminar".'], imagem: 'img/help/chat/terminar_chamada.gif',
      },
      // Call
      {
        paginaBefore: 'Call', titulo: 'Ativar ou desativar câmara e microfone', descricao: ['Carregar no botão "Microfone" ou "Câmara" para ativar ou desativar.'], imagem: 'img/help/call/micro_camara.gif',
      },
      {
        paginaBefore: 'Call', titulo: 'Mudar fundo de câmara', descricao: ['Carregar no botão "Fundos", escolher o fundo e clicar em "Confirmar"', 'Para remover o fundo aplicado, carregar no botão "Fundo" e clicar "Repor".'], imagem: 'img/help/call/fundos.gif',
      },
      {
        paginaBefore: 'Call', titulo: 'Tocar sons', descricao: ['Carregar no botão "Sons", seleccionar o som que pretende tocar, ajustar o volume à sua preferência e clicar "Tocar".'], imagem: 'img/help/call/sons.gif',
      },
      {
        paginaBefore: 'Call', titulo: 'Voltar à conversa', descricao: ['Ao carregar no botão de voltar atrás será reencaminhado para o ecrã de conversa onde pode enviar mensagens, ficheiros, iniciar jogos, etc...'], imagem: 'img/help/call/voltar_conversa.gif',
      },
      {
        paginaBefore: 'Call', titulo: 'Terminar chamada', descricao: ['De forma a terminar uma chamada, basta carregar no botão "Terminar".'], imagem: 'img/help/call/terminar_chamada.gif',
      },
    ] as {titulo: string, descricao:string[], imagem?:string, paginaBefore: string }[],
  }),
  methods: {
    openDialogKeybinds() {
      this.dialogKeybinds = true;
    },
    closeDialogKeybinds() {
      this.dialogKeybinds = false;
    },
    goBack() {
      this.$router.push({ name: this.$route.params.p });
    },
  },
});
</script>
