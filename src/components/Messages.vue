<template>
  <div class="mt-2 ic-messages">
    <!-- Cada grupo de mensagens -->
    <div
      class="ic-message"
      v-for="(msgs, i) in computedMensagens"
      :key="i"
      :author="parseAutor(msgs[0].autor)">

      <!-- Avatar -->
      <div class="ic-author-avatar">
        <vs-avatar v-if="$store.getters['contactos/getAvatar'](msgs[0].autor)">
          <img :src="require(`../assets/${$store.getters['contactos/getAvatar'](msgs[0].autor)}`)">
        </vs-avatar>
        <vs-avatar v-else>
          <template #text>
            {{ msgs[0].autor }}
          </template>
        </vs-avatar>
      </div>

      <div class="ic-message-content">
        <span class="ic-author-info">
          {{ parseAutor(msgs[0].autor) }}
          <span v-if="msgs[0].sistema" class="ic-system-tag rounded-corners">
            Sistema
          </span>
        </span>

        <span class="ic-message-timestamp">
          {{ msgs[0].momento.toGMTString().slice(0,-7) }}
        </span>

        <div class="ic-message-body"
          v-for="(mensagem, j) in msgs"
          :key="j">

          <!-- Hora da mensagem, se não for a primeira mensagem -->
          <span
            v-if="j !== 0"
            class="ic-message-time">
            {{ getHoras(mensagem.momento) }}
          </span>

          <div v-if="mensagem.texto">
            <span v-html="mensagem.texto" />
            <br />
          </div>

          <!-- FICHEIRO -->
          <a
            class="vs-button vs-button--icon vs-button--darker vs-button--default"
            :style="`text-decoration:none;width:${mensagem.ficheiro.length}em;`"
            v-if="mensagem.ficheiro"
            :href="mensagem.ficheiro"
            download
            >
            <div class="vs-button__content">
              {{ mensagem.ficheiro }}
              <i class="fa-solid fa-download ml-2 mb-1"></i>
            </div>
          </a>

          <!-- IMAGEM -->
          <img
            v-if="mensagem.imagem"
            class="rounded-corners"
            width="300px"
            :src="require(`../assets/${mensagem.imagem}`)" />

          <!-- TODO CHAMADA -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$timeColor: #72767d;

.ic-messages {
  color: #fff;
  font-size: 16px;
}

.ic-message {
  background-color: rgb(var(--vs-dark));
  display: flex;
  font-size: 0.9em;
  margin: 1em 0;
  padding: 0.25em 1em 0;

  .ic-author-avatar {
    margin-top: 1px;
    margin-right: 16px;
    min-width: 40px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  .ic-message-timestamp {
    color: $timeColor;
    font-size: 12px;
    margin-left: 3px;
  }

  .ic-message-time {
    position: absolute;
    color: rgb(var(--vs-dark));
    margin-left:-50px;
    font-size: 12px;
  }

  .ic-message-content {
    width: 100%;
    line-height: 160%;
    font-weight: normal;
    overflow-wrap: anywhere;
  }

  .ic-message-body {
    position: relative;
    width: 840px;
  }

  .ic-message-body:hover {
    background-color: rgb(var(--message-hover-color));

    .ic-message-time {
      color: $timeColor;
    }
  }

  .ic-author-info {
    display: inline-flex;
    align-items: center;
    font-size: 15px;

    .ic-author-username {
      font-size: 1.1em;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .ic-system-tag {
      background-color: rgb(var(--vs-primary));
      font-size: 0.8em;
      margin-left: 5px;
      padding: 3px;
      line-height: 100%;
      text-transform: uppercase;
    }
  }
}
</style>

<script lang="ts">
import Vue from 'vue';
import { groupBy } from '@/utils';
import { Mensagem } from '@/typings/typings';

export default Vue.extend({
  props: {
    mensagens: {
      type: Object as () => Mensagem[],
    },
  },
  methods: {
    parseAutor(autor: string): string {
      if (autor === '$$user$$') { return this.$store.state.user.contacto.nome; }
      return autor;
    },
    getHoras(data: Date) {
      const d = data.toTimeString();
      return d.slice(0, d.indexOf(':') + 3);
    },
  },
  computed: {
    computedMensagens() {
      if (!this.mensagens.length) return [];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return groupBy(this.mensagens as Record<string, any>[], 'autor');
    },
  },
});
</script>
