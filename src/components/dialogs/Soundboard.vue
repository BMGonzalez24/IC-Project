<template>
  <vs-dialog
    prevent-close
    v-model="isVisible"
    @close="closeDialog"
    not-center>
    <div style="width:500px;">
      <div class="ml-6 mr-6">
        <h2>Sons</h2>

        <p>Volume música: <small>{{ volume }}%</small></p>
          <VueSlider
            v-model="volume"
            @change="changeVolume"
            tooltip="none"
            :min="0"
            :max="100"
            :interval="5"
            drag-on-click />

        <vs-button-group style="width:64px;">
          <vs-button
            @click="addVolume(-5)"
            :disabled="volume - 5 < 0"
            v-shortkey="['-']"
            @shortkey="volume - 5 >= 0 ? addVolume(-5) : () => {}">
            -
          </vs-button>
          <vs-button
            @click="addVolume(5)"
            :disabled="volume + 5 > 100"
            v-shortkey="['+']"
            @shortkey="volume + 5 <= 100 ? addVolume(5) : () => {}">
            +
          </vs-button>
        </vs-button-group>

        <p>Músicas e Sons</p>
        <vs-table
          v-model="selected"
          striped
          style="height:300px;overflow-y:scroll;">
          <template #notFound>
            Sem resultados
          </template>

          <!-- Header -->
          <template #thead>
            <vs-tr>
              <vs-th
                sort
                @click="songs = $vs.sortData($event, sortedSongs, 'nome')">
                Nome
              </vs-th>
              <vs-th
                sort
                @click="songs = $vs.sortData($event, sortedSongs, 'duracao')">
                Duração
              </vs-th>
            </vs-tr>
          </template>

          <!-- Body -->
          <template #tbody>
            <vs-tr
              v-for="(som, i) in songs"
              :key="i"
              :data="som"
              :is-selected="selected && selected.nome === som.nome">

              <!-- Nome -->
              <vs-td>
                {{ som.nome }}
              </vs-td>

              <!-- Duração -->
              <vs-td>
                {{ ms(som.duracao) }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </div>
    </div>

    <template #footer>
      <div class="grid">
        <vs-row justify="end">
          <vs-col w="7" class="mr-2">
            <vs-button
              @click="closeDialog"
              style="float:left;"
              v-shortkey="['c']"
              @shortkey="closeDialog">
              <i class="fa-solid fa-xmark mr-2"></i>
              <u>C</u>ancelar
            </vs-button>
            <vs-button
              danger
              :disabled="aTocar === 0"
              @click="stop"
              style="float:left;"
              v-shortkey="['p']"
              @shortkey="aTocar.length !== 0 ? stop() : () => {}">
              <i class="fa-solid fa-stop mr-2"></i>
              <u>P</u>arar
            </vs-button>
            <vs-button
              success
              :disabled="!selected"
              @click="play"
              style="float:left;"
              v-shortkey="['t']"
              @shortkey="selected ? play() : () => {}">
              <i class="fa-solid fa-play mr-2"></i>
              <u>T</u>ocar
            </vs-button>
          </vs-col>
        </vs-row>
      </div>
    </template>
  </vs-dialog>
</template>

<script lang="ts">
/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
import Vue from 'vue';
import ms from 'ms';
import 'vue-slider-component/theme/antd.css';
import VueSlider from 'vue-slider-component';
import { Contacto, Som } from '@/typings/typings';

export default Vue.extend({
  components: {
    VueSlider,
  },
  props: {
    isVisible: {
      type: Object as () => boolean,
    },
    chat: {
      type: Object as () => Contacto,
    },
  },
  watch: {
    isVisible: {
      immediate: true,
      handler(active: boolean) {
        if (active) {
          const audios = document.getElementById('audios');
          if (audios) {
            this.aTocar = audios.children.length;
          }
        }
      },
    },
  },
  data: () => ({
    volume: 75,
    lastVol: 75,
    selected: null as Som | null,
    songs: [
      { nome: 'Amogus', path: 'amogus.mp3', duracao: 4000 },
      { nome: 'Astronauta no Oceano', path: 'astronaut_ocean.mp3', duracao: 13000 },
      { nome: 'Boss AC - Sexta Feira', path: 'bossac.mp3', duracao: 177000 },
      { nome: 'Burgir', path: 'burgir.mp3', duracao: 1000 },
      { nome: 'Can you feel my heart', path: 'can_you_feel_my_heart.mp3', duracao: 228000 },
      { nome: 'Careless Whisper', path: 'careless_whisper.mp3', duracao: 300000 },
      { nome: 'Cyberpunk', path: 'cyberpunk.mp3', duracao: 2000 },
      { nome: 'Discord', path: 'discord.mp3', duracao: 1000 },
      { nome: 'Hallelujah', path: 'hallelujah.mp3', duracao: 2000 },
      { nome: 'Ihh ca burro', path: 'ihh_ca_burro.mp3', duracao: 1000 },
      { nome: 'John Cena', path: 'john_cena.mp3', duracao: 49000 },
      { nome: 'Jojos Three Pillar Theme - Ayayay', path: 'jojo_ayayay.mp3', duracao: 10000 },
      { nome: 'League of Legendas', path: 'anuncio_lol.mp3', duracao: 103000 },
      { nome: 'MLG Airhorn', path: 'mlg_airhorn.mp3', duracao: 3000 },
      { nome: 'Never Gonna Give You Up', path: 'never_gonna_give_you_up.mp3', duracao: 212000 },
      { nome: 'Não é não', path: 'nao_e_nao.mp3', duracao: 1000 },
      { nome: 'Olha tanta luz', path: 'olha_tanta_luz.mp3', duracao: 2000 },
      { nome: 'Polozhenie - Zedline', path: 'polozhenie.mp3', duracao: 67000 },
      { nome: 'Pingo doce', path: 'pingo_doce.mp3', duracao: 60000 },
      { nome: 'Shape of you', path: 'shape_of_you.mp3', duracao: 235000 },
      { nome: 'Shooting Stars', path: 'shooting_stars.mp3', duracao: 6000 },
      { nome: 'Super idol', path: 'super_idol.mp3', duracao: 14000 },
      { nome: 'Um bom natal', path: 'a_todos_um_bom_natal.mp3', duracao: 222000 },
      { nome: 'Um Volto Já - João Pedro Pais', path: 'um_volto_ja.mp3', duracao: 257000 },
      { nome: 'Vine Boom', path: 'vine_boom.mp3', duracao: 1000 },
      { nome: 'Yeah Baby', path: 'yeah_baby.mp3', duracao: 7000 },
    ] as Som[],
    aTocar: 0,
  }),
  computed: {
    sortedSongs(): Som[] {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.songs.slice(0).sort((a, b) => {
        if (a.nome < b.nome) { return -1; }
        if (a.nome > b.nome) { return 1; }
        return 0;
      });
    },
  },
  methods: {
    ms(time: number) {
      return ms(time);
    },
    addVolume(amount: number): void {
      this.volume += amount;
      this.changeVolume();
    },
    changeVolume(): void {
      if (this.volume !== this.lastVol) {
        this.lastVol = this.volume;
        const v = this.volume / 100;

        const audios = document.getElementById('audios');
        if (audios) {
          for (let i = 0; i < audios.children.length; i += 1) { (audios.children[i] as HTMLAudioElement).volume = v; }
        }
      }
    },
    closeDialog() {
      this.$emit('close');
    },
    stop() {
      this.aTocar = 0;
      const audios = document.getElementById('audios');
      if (audios) { audios.innerHTML = ''; }
    },
    play() {
      try {
        if (!this.selected) return;

        // Tocar som
        const audio = new Audio(require(`../../assets/audio/${this.selected.path}`));
        const id = `soundboard_${this.selected.nome}_${Date.now()}`;
        audio.id = id;
        audio.volume = this.volume / 100;
        audio.play();
        this.aTocar += 1;

        const $el = document.getElementById('audios');
        if ($el) $el.append(audio);

        audio.onended = () => {
          this.aTocar -= 1;
        };

        // Cenário em que o carlos se assusta
        if (this.chat.nome === 'Amigos' && this.volume === 100) {
          setTimeout(() => {
            this.$store.dispatch('contactos/setParticipantCamera', { chat: this.chat, participant: 'Carlos', cameraKey: 'CarlosAssustado' });
          }, 1 * 1000);
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        let msg = err.message;
        if (err.message.startsWith('Cannot find module')) {
          msg = `Ficheiro de áudio ${this.selected?.path} não encontrado.`;
        }

        this.$vs.notification({
          color: 'danger',
          position: 'top-right',
          title: 'Erro ao tocar som',
          text: msg,
        });
      }
    },
  },
});

</script>
