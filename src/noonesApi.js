const axios = require('axios');
const { AuthorizationCode } = require('simple-oauth2');

const createNoonesApi = (clientId, clientSecret) => {
  const oauthClient = new AuthorizationCode({
    client: {
      id: clientId,
      secret: clientSecret,
    },
    auth: {
      tokenHost: 'https://auth.noones.com',
      tokenPath: '/oauth2/token',
    },
  });

  const getToken = async () => {
    const tokenParams = {
      scope: 'trade-chat/post trade/get',
    };

    const result = await oauthClient.getToken(tokenParams);
    return result.token.access_token;
  };

  const apiClient = axios.create({
    baseURL: 'https://api.noones.com',
  });

  apiClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const invoke = async (path, params) => {
    const method = path.endsWith('/post') ? 'post' : 'get';
    const response = await apiClient[method](path, params);
    return response.data;
  };

  return {
    invoke,
  };
};

module.exports = {
  createNoonesApi,
};
