import axios from 'axios';
import { clientCredentials } from 'axios-oauth-client';
import credentials from '../credentials/credentials.json' with { type: "json" };

const baseUrl = credentials.baseUrl;
const company = credentials.company;
const getClientCredentials = clientCredentials(
    axios.create(),
    credentials.oAuth.token_url,
    credentials.oAuth.client_ID,
    credentials.oAuth.client_secret
);

export const bcOperation = async (func, body) => {
    const auth = await getClientCredentials('https://api.businesscentral.dynamics.com/.default');
    const response = await axios.post(`${baseUrl}_${func}?company=${company}`, body, {
        headers: { 'Authorization': 'Bearer ' + auth.access_token }
    });

    const responseData = JSON.parse(response.data.value);
    return responseData;
}
