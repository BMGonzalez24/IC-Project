<template>
  <div>
    <NavBar style="height:66px;" class="mb-2" @goHome="recenteSeleccionado = null" />

    <div class="grid px-3" style="height:100%;">
      <vs-row justify="center" align="center" >
        <!-- Recentes (contactos) -->
        <vs-col
          w="2"
          class="mr-5"
          style="min-height:600px;">
          <!-- Barra pesquisa e star -->
          <div class="grid">
            <vs-row justify="center" align="center" class="mb-1" >
              <vs-col w="8">
                <vs-button
                  v-shortkey="['ctrl', 'g']"
                  @shortkey="openCriarGrupo"
                  block
                  @click="openCriarGrupo">
                  <i class="fa-solid fa-plus mr-2"></i>
                  Criar Grupo
                </vs-button>
              </vs-col>
              <vs-col w="3" class="ml-3">
                <vs-tooltip>
                  <vs-switch
                    warn
                    v-model="filtroGrupos">
                    <template #off>
                        <i class='fa-solid fa-user-group' ></i>
                    </template>
                    <template #on>
                        <i class='fa-solid fa-user-group' ></i>
                    </template>
                  </vs-switch>

                  <template #tooltip>
                    Filtrar grupos
                  </template>
                </vs-tooltip>
              </vs-col>
            </vs-row>
            <vs-row justify="center" align="center">
              <!-- Barra pesquisa -->
              <vs-col w="12">
                <vs-input
                  block
                  icon-before
                  v-model="recentesSearch"
                  placeholder="Pesquisa no Concord">
                  <template #icon>
                    <i class="fa-solid fa-magnifying-glass"></i>
                  </template>
                </vs-input>
              </vs-col>
            </vs-row>
          </div>

          <!-- Tabela Recentes -->
          <!-- Aceleradores -->
          <div
            v-shortkey="['ctrl', 'arrowup']"
            @shortkey="selecionar(-1)">
          </div>
          <div
            v-shortkey="['ctrl', 'arrowdown']"
            @shortkey="selecionar(1)">
          </div>

          <!-- v-model="recenteSeleccionado" -->
          <vs-table
            v-if="reRenderTable"
            primary
            style="height:530px;max-height:530px;overflow-y:scroll"
            class="mt-2">
            <template #notFound>
              Sem resultados
            </template>
            <!-- Body -->
            <template #tbody>
              <vs-tr
                v-for="(contacto, i) in computedRecentes"
                :key="i"
                @click="recenteSeleccionado = contacto"
                :is-selected="recenteSeleccionado && recenteSeleccionado.nome == contacto.nome">

                <vs-td>
                  <!-- Avatar -->
                  <div>
                    <vs-avatar v-if="$store.getters['contactos/getAvatar'](contacto.nome)">
                      <img :src="require(`../assets/${$store.getters['contactos/getAvatar'](contacto.nome)}`)">
                    </vs-avatar>
                    <vs-avatar v-else>
                      <template #text>
                        {{ contacto.nome }}
                      </template>
                    </vs-avatar>
                  </div>
                </vs-td>
                <vs-td class="td_nome">
                  <!-- Nome -->
                  <span style="z-index:-1;">{{ minifyName(contacto.nome, contacto.grupo, $store.state.user.contacto.emChamada && $store.state.user.contacto.emChamada.nome === contacto.nome) }}</span>

                  <vs-tooltip
                    v-show="contacto.grupo"
                    class="mx-1"
                    style="float:right;">
                    <i class="fa-solid fa-user-group"
                      :style="{ 'color': 'gold'}"/>
                    <template #tooltip>
                      Grupo
                    </template>
                  </vs-tooltip>

                  <vs-tooltip
                    v-show="$store.state.user.contacto.emChamada && $store.state.user.contacto.emChamada.nome === contacto.nome"
                    class="mx-1"
                    style="float:right;">
                    <i id="chamadaIconContactos"
                      :class="{
                        'fa-solid': true,
                        'fa-phone': !$store.state.user.chamada.imagem,
                        'fa-video': !!$store.state.user.chamada.imagem}" />

                    <template #tooltip>
                      Em {{!!$store.state.user.chamada.imagem ? 'video' : ''}}chamada
                    </template>
                  </vs-tooltip>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </vs-col>

        <!-- Parte Chat/Chamada -->
        <vs-col
          w="9"
          v-if="recenteSeleccionado"
          class="pb-0"
          style="height:600px">
          <div style="width:100%;">
            <!-- Header -->
            <div class="grid mb-2 rounded-corners border-bottom-darker">
              <vs-row align="center">
                <vs-col w="6">
                  <div class="ml-3">
                    <vs-button
                      v-if="$route.name === 'Call'"
                      v-shortkey="['v']"
                      @shortkey="$router.push({ name: 'Chat' })"
                      @click="$router.push({ name: 'Chat' })"
                      transparent
                      style="float:left;margin-top:15px;height:44px;width:44px;">
                      <i class="fa-solid fa-angles-left" data-fa-transform="grow-18"></i>
                    </vs-button>

                    <vs-avatar
                      v-if="$store.getters['contactos/getAvatar'](recenteSeleccionado.nome)"
                      style="float:left;margin-top:15px;">
                      <img :src="require(`../assets/${$store.getters['contactos/getAvatar'](recenteSeleccionado.nome)}`)">
                    </vs-avatar>
                    <vs-avatar
                      v-else
                      style="float:left;margin-top:15px;">
                      <template #text>
                        {{ recenteSeleccionado.nome }}
                      </template>
                    </vs-avatar>

                    <h2
                      style="float:left;"
                      class="ml-2">
                      {{ recenteSeleccionado.nome }}
                    </h2>
                  </div>
                </vs-col>
                <vs-col w="6" v-if="$route.name === 'Chat'">
                  <div class="grid">
                    <vs-row align="center" justify="end">
                      <vs-col
                        w="1"
                        class="mr-3"
                        v-if="recenteSeleccionado.grupo">
                        <vs-tooltip
                          bottom
                          interactivity>
                            <vs-button
                              style="height:34px;"
                              border
                              class="no-hover">
                              <i class="fa-solid fa-user-group"></i>
                            </vs-button>

                            <template #tooltip>
                              {{ computedContactosGrupo }}
                            </template>
                        </vs-tooltip>
                      </vs-col>
                      <vs-col w="5" class="mr-1">
                        <vs-input
                          block
                          icon-before
                          v-model="pesquisaMensagem"
                          placeholder="Pesquisa mensagem">
                          <template #icon>
                            <i class="fa-solid fa-magnifying-glass"></i>
                          </template>
                        </vs-input>
                      </vs-col>
                      <vs-col w="5">
                        <div v-if="!emChamada">
                          <vs-tooltip
                            bottom
                            shadow
                            not-hover
                            v-model="chamadaTooltip">

                            <vs-button
                              style="float:left;"
                              icon
                              v-shortkey="['a']"
                              @shortkey="entraChamada(false, false)"
                              @click="entraChamada(false, false)">
                              <i class="fa-solid fa-phone mr-2"></i>
                              <u>Á</u>udio
                            </vs-button>
                            <vs-button
                              icon
                              style="float:left;"
                              v-shortkey="['v']"
                              @shortkey="entraChamada(false, true)"
                              @click="entraChamada(false, true)">
                              <i class="fa-solid fa-video mr-2"></i>
                              <u>V</u>ídeo
                            </vs-button>

                            <template #tooltip>
                              <div class="content-tooltip">
                                <h4>
                                  Confirmar
                                </h4>
                                <p>Eencontra-se numa chamada com{{ $store.state.user.contacto.emChamada.grupo ? ' o grupo ' : ''}} <strong>{{ $store.state.user.contacto.emChamada.nome }}</strong>. Se continuar, irá terminar essa chamada.</p>
                                <footer>
                                  <div class="grid">
                                    <vs-row align="center" justify="center">
                                      <vs-col w="4">
                                        <vs-button
                                          v-shortkey="['c']"
                                          @shortkey="chamadaTooltip = false"
                                          @click="chamadaTooltip = false"
                                          style="float:left;">
                                          <u>C</u>ancelar
                                        </vs-button>
                                      </vs-col>
                                      <vs-col w="4">
                                        <vs-button
                                          v-shortkey="['o']"
                                          @shortkey="entraChamada(true, comCamara)"
                                          @click="entraChamada(true, comCamara)"
                                          danger
                                          style="float:left;">
                                          C<u>o</u>ntinuar
                                        </vs-button>
                                      </vs-col>
                                    </vs-row>
                                  </div>
                                </footer>
                              </div>
                            </template>
                          </vs-tooltip>
                        </div>
                        <div v-else style="display:flex;align-items:center">
                          <vs-button
                            style="flex:1 1 0px;"
                            v-shortkey="['r']"
                            @shortkey="entraChamada(true, !!$store.state.user.chamada.imagem, true)"
                            @click="entraChamada(true, !!$store.state.user.chamada.imagem, true)">
                            <i class="fa-solid fa-phone mr-2"></i>
                            <span><u>R</u>etomar</span>
                          </vs-button>
                          <vs-button
                            style="flex:1 1 0px;"
                            danger
                            v-shortkey="['t']"
                            @shortkey="terminarChamada"
                            @click="terminarChamada">
                            <i class="fa-solid fa-phone-slash mr-2" data-fa-transform="rotate-90"></i>
                            <span><u>T</u>erminar</span>
                          </vs-button>
                        </div>
                      </vs-col>
                    </vs-row>
                  </div>
                </vs-col>
              </vs-row>
            </div>

            <router-view
              :chat="recenteSeleccionado"
              :search="pesquisaMensagem"
              @cameraUpdate="forceRerenderTable"
              @messageSent="forceRerenderTable"
              @callEnd="forceRerenderTable"/>
          </div>
        </vs-col>

        <!-- Nada Selecionado -->
        <vs-col v-else w="9">
          <div class="grid" style="width:970px;height:100%">
            <vs-row align="center" style="height:100%;">
              <vs-col w="4">
                <i id="leftArrow" class="fa-solid fa-share" data-fa-transform="rotate-220"></i>
              </vs-col>
              <vs-col w="5">
                <vs-alert relief >
                  <template #title>
                    <h1>Nada selecionado...</h1>
                  </template>

                  <p>Selecione um contacto ou grupo da lista da esquerda!
                    <i
                    class="fa-solid fa-face-smile-wink twemoji ml-2"
                    data-fa-transform="grow-16" /></p>
                </vs-alert>
              </vs-col>
            </vs-row>
          </div>
        </vs-col>
      </vs-row>
    </div>

    <CriarGrupo
      :isVisible.sync="dialogCriarGrupo"
      @close="closeCriarGrupo"
      @criado="selecionarUltimo" />
  </div>
</template>

<style lang="scss">
.td_nome {
  min-width: 135px;
  max-width: 135px;
}

#chamadaIconContactos {
  color: rgb(var(--vs-danger));
}

#leftArrow {
  font-size: 10em;
  margin-top: 200px;
  margin-left: 70px;
  color: rgb(var(--vs-primary));
}

.vs-table table {
  max-width: 100% !important;
  min-width: 100% !important;

  tbody:not(.vs-table_not-found) {
    cursor: pointer;
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import CriarGrupo from '@/components/dialogs/CriarGrupo.vue';
import { Contacto, Mensagem } from '@/typings/typings';
import NavBar from '@/components/NavBar.vue';

export default Vue.extend({
  components: {
    NavBar,
    CriarGrupo,
  },
  data: () => ({
    dialogCriarGrupo: false,
    reRenderTable: true,
    filtroGrupos: false,
    pesquisaMensagem: '',
    recentesSearch: '',
    recenteSeleccionado: null as Contacto | null,
    chamadaTooltip: false,
    comCamara: false,
  }),
  beforeMount() {
    // Carregar chamada se tiver ido ao help ou feito refresh
    if (this.$route.name === 'Call') {
      const chamada: Contacto = this.$store.state.user.contacto.emChamada;
      if (chamada) {
        this.recenteSeleccionado = this.$store.state.contactos.recentes
          .find((c: Contacto) => c.nome === chamada.nome);
      }
    }
  },
  computed: {
    emChamada() {
      return this.recenteSeleccionado?.nome === this.$store.state.user.contacto.emChamada?.nome;
    },
    computedRecentes(): Contacto[] {
      this.forceRerenderTable();
      const query = this.recentesSearch.toLowerCase();

      return this.$store.state.contactos.recentes
        .filter((r: Contacto) => {
          let valid = !r.hidden;
          if (valid && this.recentesSearch) { valid = r.nome.toLowerCase().includes(query); }
          if (valid && this.filtroGrupos) { valid = !!r.grupo; }

          return valid;
        })
        // eslint-disable-next-line no-nested-ternary
        .map((r: Contacto) => ({ ...r, lastIteraction: r.mensagens?.length ? r.mensagens[r.mensagens.length - 1]?.momento?.getTime() : (r.createdAt instanceof Date ? r.createdAt.getTime() : 0) }))
        .sort((a: Contacto & { lastIteraction: number }, b: Contacto & { lastIteraction: number }) => b.lastIteraction - a.lastIteraction);
    },
    computedContactosGrupo() {
      if (!this.recenteSeleccionado) return [];
      console.log(this.recenteSeleccionado.naChamada);
      return [...this.recenteSeleccionado.naChamada]
        .sort((a, b) => {
          if (a.nome < b.nome) return -1;
          if (a.nome > b.nome) return 1;

          return 0;
        })
        .map((c) => c.nome)
        .join(', ');
    },
  },
  methods: {
    minifyName(nome: string, eGrupo: boolean, emChamada: boolean) {
      let cnt = 0;
      if (eGrupo) cnt += 3;
      if (emChamada) cnt += 3;

      return nome.length >= 15 - cnt ? `${nome.slice(0, 13 - cnt)}...` : nome;
    },
    openCriarGrupo() {
      this.dialogCriarGrupo = true;
    },
    closeCriarGrupo(): void {
      this.dialogCriarGrupo = false;
    },
    selecionarUltimo(): void {
      if (this.computedRecentes.length) { [this.recenteSeleccionado] = this.computedRecentes; }
    },
    selecionar(sentido: number) {
      if (!this.recenteSeleccionado) return;

      const idx = this.computedRecentes.findIndex((c) => c.nome === this.recenteSeleccionado?.nome);
      if ((idx === 0 && sentido < 0)
        || (idx === this.computedRecentes.length - 1 && sentido > 0)) { return; }

      this.recenteSeleccionado = this.computedRecentes[idx + sentido];
    },
    getAvatar(nome: string) {
      return this.$store.state.contactos.avatars[nome];
    },
    forceRerenderTable() {
      this.reRenderTable = false;

      this.$nextTick().then(() => {
        this.reRenderTable = true;
      });
    },
    terminarChamada() {
      this.$store.dispatch('contactos/setLastCallDuration', this.recenteSeleccionado);
      this.$store.dispatch('user/leaveCall');
    },
    entraChamada(force: boolean, camera: boolean, jaNaChamada: boolean) {
      if (!force && (this.$store.state.user.contacto.emChamada?.nome && this.$store.state.user.contacto.emChamada?.nome !== this.recenteSeleccionado?.nome)) {
        this.chamadaTooltip = true;
        this.comCamara = camera;
        return;
      }
      this.chamadaTooltip = false;

      setTimeout(() => {
        this.forceRerenderTable();

        if (!jaNaChamada) {
          this.$store.dispatch('contactos/sendMessage', {
            chat: this.recenteSeleccionado,
            mensagem: {
              autor: 'Chamada',
              sistema: true,
              momento: new Date(),
              texto: `<strong>${this.$store.state.user.contacto.nome}</strong> começou uma ${camera ? 'video' : ''}chamada.`,
              chamada: {
                inicio: new Date(),
              },
            } as Mensagem,
          });

          if (this.$store.state.user.contacto.emChamada?.nome !== this.recenteSeleccionado?.nome) {
            this.$store.dispatch('contactos/setLastCallDuration', this.$store.state.user.contacto.emChamada);
          }
        }

        this.$store.dispatch('user/joinCall', this.recenteSeleccionado);
        if (!!this.$store.state.user.chamada.imagem !== camera) { this.$store.dispatch('user/toggleImage'); }
        this.$router.push({ name: 'Call' });
      }, 10);
    },
  },
});
</script>
