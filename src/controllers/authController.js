// controllers/authController.js
const axios = require('axios');
const { githubAuth } = require('../config/appconfig.js');
const { client_id, client_secret } = githubAuth;

const exchangeCodeForToken = async (code) => {
  const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', null, {
    params: {
      client_id,
      client_secret,
      code,
      redirect_uri: 'http://localhost:3000',
    },
    headers: {
      Accept: 'application/json',
    },
  });

  return tokenResponse.data.access_token;
};

const fetchGitHubUserData = async (access_token) => {
  const userDataResponse = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  return userDataResponse.data;
};

const githubCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('Authorization code is missing');
  }

  try {
    const access_token = await exchangeCodeForToken(code);
    if (!access_token) {
      return res.status(400).send('Error exchanging code for access token');
    }

    const userData = await fetchGitHubUserData(access_token);
    const { login, email, avatar_url, name } = userData;
    return res.json({ login, email, avatar_url, name });

  } catch (error) {
    console.error('GitHub OAuth error', error);
    res.status(500).send('Error during GitHub OAuth process');
  }
};

module.exports = { githubCallback };
