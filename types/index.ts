export interface iMetadados {
  nome: string;
  pesquisa: string;
  periodicidade: {
    frequencia: string;
    inicio: number;
    fim: number;
  };
  classificacoes: {
    id: number;
    nome: string;
    sumarizacao: {
      status: string;
      excecao: [];
    }[];
    categorias: {
      id: number;
      nome: string;
      nivel: number;
    }[];
  }[];
  variaveis: {
    id: number;
    nome: string;
    unidade: string;
    sumarizacao: [];
  }[];
}

export interface iDados {
  id: number;
  variavel: string;
  unidade: string;

  resultados: {
    classificacoes: {
      id: number;
      nome: string;
      categoria: Record<string, string>;
    }[];
    series: {
      localidade: {
        id: number;
        nome: string;
        nivel: {
          id: number;
          nome: string;
        };
      };
      serie: Record<string, string>;
    }[];
  }[];
}
