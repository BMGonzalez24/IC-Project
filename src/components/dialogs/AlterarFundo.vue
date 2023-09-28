<template>
  <vs-dialog
    prevent-close
    v-model="isVisible"
    @close="closeDialog">
    <div style="width:500px;">
      <div class="ml-5">
        <h2>Alterar fundo de Câmara</h2>
        <p>Visualização</p>
        <img
          id="imgPreview"
          class="rounded-corners ml-2"
          :src="require(`../../assets/${getUserImage}`)"
          :style="{
            'width': '250px',
            'height': '140px',
            'background-image' :`url('${require(`../../assets/${fundoAtivo ? fundoAtivo.href : $store.state.user.chamada.background}`)}')`,
            'background-size': '100% 100%',
            'pointer': 'cursor',
          }" />
      </div>

      <p class="ml-5">Fundos</p>
      <div class="grid">
        <vs-row justify="center" align="center">
          <vs-col
            w="5"
            v-for="(imagem, i) in imagensFundo"
            :key="i">
            <vs-tooltip>
              <img
                @click="() => imagemClick(imagem)"
                :class="`${imagem.ativo ? 'imgselecionada' : ''} rounded-corners`"
                :src="require(`../../assets/${imagem.href}`)"
                width="200px"
                height="112px"
                />

              <template #tooltip>
                {{ imagem.tooltip }}
              </template>
            </vs-tooltip>
          </vs-col>
        </vs-row>
      </div>
    </div>

    <template #footer>
      <div class="grid" style="width:100%;">
        <vs-row class="ml-5">
          <vs-col w="2">
            <vs-button
              style="margin-left:-8px"
              transparent
              @click="reporFundo"
              v-shortkey="['r']"
              @shortkey="reporFundo">
              <i class="fa-solid fa-reply mr-2"></i>
              <u>R</u>epor
            </vs-button>
          </vs-col>
          <vs-col offset="2" w="8">
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
                @click="submeterFundo"
                :disabled="!fundoAtivo"
                v-shortkey="['a']"
                @shortkey="fundoAtivo ? submeterFundo() : () => {}">
                <i class="fa-solid fa-check mr-2"></i>
                <u>A</u>lterar fundo
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
</style>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    isVisible: {
      type: Object as () => boolean,
    },
  },
  data: () => ({
    imagensFundo: [
      {
        href: 'img/fundos/vulcao.png',
        ativo: false,
        tooltip: 'Vulcão',
      },
      {
        href: 'img/fundos/peixes.jpg',
        ativo: false,
        tooltip: 'Peixes',
      },
      {
        href: 'img/fundos/praia.jpg',
        ativo: false,
        tooltip: 'Praia',
      },
      {
        href: 'img/fundos/leiria.jpg',
        ativo: false,
        tooltip: 'Leiria',
      },
    ],
  }),
  computed: {
    fundoAtivo(): { href: string, ativo: boolean } | undefined {
      return this.imagensFundo.find((i) => i.ativo);
    },
    getUserImage() {
      return this.$store.state.user.chamada.imagem || 'img/linus_nobg.png';
    },
  },
  methods: {
    imagemClick(imagem: { href: string, ativo: boolean }): void {
      // Meter imagem ativa
      for (let i = 0; i < this.imagensFundo.length; i += 1) {
        if (this.imagensFundo[i].href === imagem.href) {
          this.imagensFundo[i].ativo = true;
        } else {
          this.imagensFundo[i].ativo = false;
        }
      }
    },

    closeDialog(): void {
      this.$emit('close');
    },
    reporFundo(): void {
      this.$store.dispatch('user/resetBackground');
      for (let i = 0; i < this.imagensFundo.length; i += 1) {
        this.imagensFundo[i].ativo = false;
      }

      this.closeDialog();
    },
    submeterFundo(): void {
      this.$store.dispatch('user/setBackground', this.fundoAtivo?.href);
      this.closeDialog();
    },
  },
});
</script>
