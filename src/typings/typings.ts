/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */

export interface Contacto {
    nome: string,
    naChamada: ParticipanteChamada[],
    createdAt: Date,
    grupo?: boolean,
    email?: string,
    hidden?: boolean,
    mensagens?: Mensagem[],
    command?: () => void // used on ListBox
}

export interface ParticipanteChamada {
    nome: string,
    micro?: boolean,
    camera?: boolean | string,
}

export interface Mensagem {
    autor: string,
    texto: string,
    momento: Date,
    imagem?: string,
    ficheiro?: Ficheiro,
    sistema?: boolean,
    chamada: {
        inicio: Date,
        /**
         * Duracao da chamada em ms
         */
        duracao?: number,
    },
}

export interface Ficheiro {
    nome: string,
    tamanho: string,
}

export interface Som {
    nome: string,
    path: string,
    duracao?: number,
}
