const axios = require('axios').default;
const api = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades',
});

export const getEstados = async () => {
  const dados = (await api.get('/estados', {
    params: {
      orderBy: 'nome',
    },
  })).data;

  return dados.map(estado => {
    return {uf: estado.sigla, nome: estado.nome};
  });
};

export const getMunicipiosByEstado = async uf => {
  const dados = (await api.get(`estados/${uf}/municipios`, {
    params: {
      orderBy: 'nome',
    },
  })).data;

  return dados.map(municipio => {
    return {
      nome: municipio.nome,
    };
  });
};
