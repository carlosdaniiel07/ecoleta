const axios = require('axios').default;

export const baseURL = 'https://ecoleta-node-api.herokuapp.com';

const api = axios.create({
  baseURL,
});

export default api;
