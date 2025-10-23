export interface ICriarNoticiaDTO {
  titulo: string;
  slug?: string;
  resumo?: string;
  conteudo: string;
  imagem_url?: string;
  autor?: string;
  fonte?: string;
  fonte_url?: string;
  tags?: string[];
  publicada?: boolean;
  destaque?: boolean;
  data_publicacao?: Date;
}

export interface IAtualizarNoticiaDTO {
  titulo?: string;
  slug?: string;
  resumo?: string;
  conteudo?: string;
  imagem_url?: string;
  autor?: string;
  fonte?: string;
  fonte_url?: string;
  tags?: string[];
  publicada?: boolean;
  destaque?: boolean;
  data_publicacao?: Date;
}

export interface INoticiaWebhookDTO {
  titulo: string;
  resumo?: string;
  conteudo: string;
  imagem_url?: string;
  autor?: string;
  fonte_url?: string;
  tags?: string[];
  data_publicacao?: string;
}
